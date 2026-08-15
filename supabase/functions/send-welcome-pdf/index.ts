import { createClient } from 'jsr:@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts, type PDFPage, type PDFFont } from 'https://esm.sh/pdf-lib@1.17.1';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = 'Lucas Muindi <contacto@graphic.designer>';
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
  if (!RESEND_API_KEY) return json({ error: 'RESEND_API_KEY não configurada nas secrets do projeto.' }, 500);

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
    if (!briefing.contact_is_email) return json({ error: 'Contacto não é um e-mail válido' }, 400);

    const serviceLabel = SERVICE_LABELS[briefing.service_type] || briefing.service_type;
    const pdfBytes = await buildBriefingPdf(briefing, serviceLabel);
    const pdfBase64 = base64Encode(pdfBytes);

    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: briefing.client_contact,
        subject: `Briefing recebido — ${serviceLabel}`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#fff;padding:32px">
            <h1 style="font-size:20px">Olá, ${escapeHtml(briefing.client_name)}!</h1>
            <p style="font-size:14px;line-height:1.6;color:#ccc">Recebemos o seu briefing de <strong>${escapeHtml(serviceLabel)}</strong>. Encontra em anexo uma cópia completa das respostas enviadas.</p>
            <p style="font-size:13px;color:#888;margin-top:24px">— Lucas Muindi</p>
          </div>
        `,
        attachments: [{ filename: `Briefing_${safeFilename(serviceLabel)}.pdf`, content: pdfBase64 }],
      }),
    });

    if (!resendResp.ok) {
      const details = await resendResp.text();
      console.error('Erro do Resend:', details);
      return json({ error: 'Falha ao enviar e-mail', details }, 502);
    }

    await supabase
      .from('briefings')
      .update({ pdf_sent: true, pdf_sent_at: new Date().toISOString() })
      .eq('id', briefing_id);

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
  const pageSize: [number, number] = [595, 842];
  const margin = 56;
  const maxWidth = pageSize[0] - margin * 2;
  const colors = { black: rgb(0.04, 0.04, 0.04), gray: rgb(0.38, 0.38, 0.38), brand: rgb(0.36, 0.24, 0.94) };

  let page = pdfDoc.addPage(pageSize);
  let y = 786;

  const ensureSpace = (height: number) => {
    if (y - height < margin) {
      page = pdfDoc.addPage(pageSize);
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

  drawWrapped('Obrigado por partilhar a sua visão. Entraremos em contacto para os próximos passos.', 10, bold, colors.black, 4);
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
