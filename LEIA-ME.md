# Welcome Packs personalizados por serviço

## O que foi implementado

O painel admin agora apresenta um cartão para cada um dos sete serviços e permite editar o conteúdo do Welcome Pack sem abrir o código. O design continua a ser o mesmo brand book editorial de sete páginas; apenas os textos, etapas, prazos, contactos e informações de cada serviço variam.

Os serviços suportados são `branding`, `identidade-visual`, `social-media`, `design-publicitario`, `design-eventos`, `web-design` e `materiais-graficos`.

O briefing público identifica o serviço selecionado, lê o Welcome Pack correspondente no Supabase e usa esse conteúdo para gerar o PDF enviado ao cliente. Se não existir um registo personalizado, o ficheiro `js/welcome-pack-defaults.js` fornece um fallback seguro.

## Ficheiros alterados

| Ficheiro | Função |
|---|---|
| `briefing.html` | Carrega o Welcome Pack do serviço e preenche as sete páginas do PDF antes do envio. |
| `admin.html` | Editor organizado por páginas para os sete serviços. |
| `js/admin.js` | Carregamento, edição e gravação do conteúdo por serviço. |
| `js/data.js` | Upsert do documento com o campo JSONB `content`. |
| `js/welcome-pack-defaults.js` | Estrutura e textos padrão dos sete Welcome Packs. |
| `css/admin.css` | Estilos do editor por páginas. |
| `migrations/20260815_welcome_packs_by_service.sql` | Migração que adiciona `content`, seeds, constraint e política pública de leitura. |

## Supabase

A migração foi aplicada no projeto `lucas-muindi-portfolio` (`drdvngmmaisqmyyahftn`). Foram confirmados sete registos, um por serviço. A leitura está disponível para `anon` e `authenticated`; a escrita continua limitada à política autenticada existente do painel.

## Publicação no Vercel

Ainda é necessário publicar manualmente os ficheiros alterados no Vercel. Copia estes ficheiros mantendo as mesmas pastas do projeto, substituindo as versões antigas:

```text
briefing.html
admin.html
css/admin.css
js/admin.js
js/data.js
js/welcome-pack-defaults.js
```

Depois da publicação, faz `Ctrl + Shift + R` no admin e no briefing. Entra na área de documentos de serviço, abre cada cartão e altera o conteúdo. Ao guardar, o conteúdo fica associado apenas ao serviço selecionado.

O Google Apps Script não precisa de ser alterado nesta funcionalidade, porque continua a receber o PDF final já gerado no navegador. O PDF interno com as respostas do briefing também permanece separado e continua destinado apenas ao administrador.

## Validações realizadas

A sintaxe dos ficheiros JavaScript foi validada, os IDs duplicados no admin foram eliminados, o template do briefing foi verificado e a migração foi confirmada no Supabase com os sete serviços e a política pública de leitura.

A publicação no Vercel não foi executada automaticamente.
