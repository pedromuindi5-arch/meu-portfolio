# Correção visual dos PDFs — Welcome Pack e Briefing

## O que foi corrigido

O problema observado no `Boas-vindas_Branding_Cliente.pdf` vinha da geometria do wrapper de exportação: o conteúdo era capturado numa área mais estreita do que a página A4, ficando comprimido à esquerda e gerando páginas extra. O wrapper foi normalizado para ocupar a largura total da página, com margens internas consistentes e sem a combinação de quebras que duplicava páginas.

O Welcome Pack continua com sete páginas A4 e agora mantém a mancha gráfica centrada. O PDF interno do briefing foi redesenhado para usar a mesma identidade editorial: capa preta, página de respostas clara, tipografia hierárquica, cartões arredondados, rótulos em caixa alta, linhas finas e rodapés consistentes.

## Ficheiros a substituir no projeto Vercel

Copiar os ficheiros preservando as pastas:

```text
briefing.html                         -> raiz do projeto
js/welcome-pack-defaults.js           -> js/welcome-pack-defaults.js
```

Não é necessário alterar o Google Apps Script para esta correção de layout. O contrato de envio continua a ser o mesmo: `pdfBase64` é o briefing interno para o administrador e `welcomePdfBase64` é o Welcome Pack para o cliente.

## Publicação

Depois de substituir os ficheiros no repositório ligado ao Vercel, fazer commit e push normalmente. Quando o deployment ficar concluído, abrir o briefing em janela anónima ou fazer `Ctrl + Shift + R` para eliminar a versão antiga em cache.

## Validação local

Os previews validados são:

```text
welcome-preview-v3.pdf             7 páginas A4
briefing-content-preview-v3.pdf    2 páginas A4 com respostas preenchidas
```

O preview do briefing com conteúdo de demonstração confirma que os cartões de respostas ocupam a grelha completa sem cortes laterais. Os PDFs anexados ao email continuarão a ser produzidos pelo navegador do cliente usando o mesmo template atualizado.
