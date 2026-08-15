import { createClient } from 'jsr:@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts, type PDFFont } from 'https://esm.sh/pdf-lib@1.17.1';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = 'Lucas Muindi — Site <contacto@graphic.designer>';
const ADMIN_EMAIL = 'pedromuindi5@gmail.com';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SERVICE_LABELS: Record<string, string> = {
  'identidade-visual': 'Identidade Visual',
  'design-publicitario': 'Flyer / Design Publicitário',
  'social-media': 'Social Media',
  'design-eventos': 'Design para Eventos',
  'materiais-graficos': 'Materiais Gráficos',
  'web-design': 'Web Design',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método não permitido' }, 405);
  if (!RESEND_API_KEY) return json({ error: 'RESEND_API_KEY não configurada.' }, 500);

  try {
    const { briefing_id } = await req.json();
    if (!briefing_id) return json({ error: 'briefing_id em falta' }, 400);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data: briefing, error } = await supabase
      .from('briefings')
      .select('id, service_type, client_name, client_contact, contact_is_email, form_data')
      .eq('id', briefing_id)
      .single();

    if (error || !briefing) return json({ error: 'Briefing não encontrado' }, 404);

    const serviceLabel = SERVICE_LABELS[briefing.service_type] || briefing.service_type;
    const formData = briefing.form_data && typeof briefing.form_data === 'object' ? briefing.form_data : {};
    const { data: briefingAttachments } = await supabase
      .from('briefing_attachments')
      .select('file_name, storage_path')
      .eq('briefing_id', briefing_id)
      .order('created_at', { ascending: true });
    const attachmentLinks = await Promise.all((briefingAttachments || []).map(async (file: any) => {
      const { data: signed } = await supabase.storage.from('briefing-references').createSignedUrl(file.storage_path, 60 * 60 * 24 * 7);
      return signed?.signedUrl ? `<li><a href="${escapeHtml(signed.signedUrl)}" style="color:#7a5cff">${escapeHtml(file.file_name)}</a></li>` : `<li>${escapeHtml(file.file_name)}</li>`;
    }));
    const attachmentsHtml = attachmentLinks.length
      ? `<h2 style="font-size:14px;margin:24px 0 8px">Referências anexadas</h2><ul style="padding-left:20px;color:#fff">${attachmentLinks.join('')}</ul>`
      : '';
    const rowsHtml = Object.entries(formData).map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #262626;color:#888;font-size:12px;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #262626;color:#fff;font-size:13px;white-space:pre-wrap">${escapeHtml(value)}</td>
      </tr>
    `).join('');

    const pdfBytes = await buildBriefingPdf(briefing, serviceLabel);
    const pdfBase64 = base64Encode(pdfBytes);
    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        reply_to: briefing.contact_is_email ? briefing.client_contact : undefined,
        subject: `Novo briefing — ${serviceLabel} — ${briefing.client_name}`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#fff;padding:32px;max-width:720px;margin:0 auto">
            <p style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#7a5cff">Novo briefing recebido</p>
            <h1 style="font-size:22px;margin:0 0 4px">${escapeHtml(briefing.client_name)}</h1>
            <p style="font-size:13px;color:#999;margin:0 0 24px">${escapeHtml(serviceLabel)} · ${escapeHtml(briefing.client_contact)}</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${rowsHtml}</table>
            ${attachmentsHtml}
            <p style="font-size:12px;color:#666">O PDF completo das respostas está anexado a este email. Os links dos ficheiros de referência ficam disponíveis durante 7 dias. O registo também está disponível no separador “Briefings” do painel administrativo.</p>
          </div>
        `,
        attachments: [{ filename: `Briefing_${safeFilename(serviceLabel)}_${safeFilename(briefing.client_name)}.pdf`, content: pdfBase64 }],
      }),
    });

    if (!resendResp.ok) {
      const details = await resendResp.text();
      console.error('Erro do Resend:', details);
      return json({ error: 'Falha ao enviar e-mail', details }, 502);
    }

    return json({ success: true });
  } catch (err) {
    console.error('Erro inesperado:', err);
    return json({ error: String(err) }, 500);
  }
});

async function buildBriefingPdf(briefing: any, serviceLabel: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const margin = 56;
  const pageWidth = 595;
  const pageHeight = 842;
  const maxWidth = pageWidth - margin * 2;
  const colors = { black: rgb(0.04, 0.04, 0.04), gray: rgb(0.38, 0.38, 0.38), brand: rgb(0.36, 0.24, 0.94) };
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = 786;

  const ensureSpace = (height: number) => {
    if (y - height < margin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = 786;
    }
  };

  const drawWrapped = (value: unknown, size: number, font: PDFFont, color: ReturnType<typeof rgb>, gap = 6) => {
    const text = String(value ?? '').trim() || 'Não especificado';
    const paragraphs = text.replace(/\r\n/g, '\n').split('\n');
    for (const paragraph of paragraphs) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      let line = '';
      const lines: string[] = [];
      for (const word of words.length ? words : ['']) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = candidate;
        }
      }
      if (line || !lines.length) lines.push(line);
      for (const current of lines) {
        ensureSpace(size + 7);
        page.drawText(current, { x: margin, y, size, font, color });
        y -= size + 7;
      }
      y -= 2;
    }
    y -= gap;
  };

  page.drawText('LUCAS MUINDI', { x: margin, y, size: 12, font: bold, color: colors.brand });
  y -= 27;
  drawWrapped(`Briefing de Projeto — ${serviceLabel}`, 21, bold, colors.black, 16);
  drawWrapped(`Cliente: ${briefing.client_name}`, 12, bold, colors.black, 3);
  drawWrapped(`Data: ${new Date().toLocaleDateString('pt-PT')}`, 10, regular, colors.gray, 18);

  const formData = briefing.form_data && typeof briefing.form_data === 'object' ? briefing.form_data : {};
  for (const [label, value] of Object.entries(formData)) {
    drawWrapped(String(label).toUpperCase(), 9, bold, colors.brand, 2);
    drawWrapped(value, 11, regular, colors.black, 12);
  }
  drawWrapped('Documento gerado automaticamente a partir das respostas submetidas.', 9, regular, colors.gray, 4);
  return pdfDoc.save();
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

function safeFilename(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'briefing';
}

function base64Encode(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  return btoa(binary);
}

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
