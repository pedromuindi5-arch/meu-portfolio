# Correção do erro dos PDFs no Gmail

## Causa

O erro aparecia porque o Apps Script alterado exigia simultaneamente `pdfBase64` e `welcomePdfBase64`, enquanto o briefing que estava publicado no Vercel era uma versão antiga e não enviava o segundo campo.

O briefing atualizado já gera os dois ficheiros:

- `pdfBase64`: PDF interno com as respostas, enviado apenas para `pedromuindi5@gmail.com`.
- `welcomePdfBase64`: PDF de boas-vindas, enviado apenas para o cliente.

## Atualização do Google Apps Script

1. Abre o projeto do Google Apps Script.
2. Abre o ficheiro `Código.gs`.
3. Apaga todo o conteúdo antigo.
4. Copia e cola o ficheiro `Code-gmail-welcome-and-briefing-fixed.gs` desta entrega.
5. Clica em **Guardar**.
6. Clica em **Implementar > Gerir implementações**.
7. Edita a implementação da Web App.
8. Escolhe **Nova versão**.
9. Mantém a execução como **Eu** e o acesso como **Qualquer pessoa**.
10. Clica em **Implementar**.

Não é necessário mudar o URL da Web App se estiveres a editar a mesma implementação.

## Atualização do Vercel

Substitui o `briefing.html` pelo ficheiro desta entrega e publica-o no Vercel. Este passo é obrigatório, porque é o briefing atualizado que cria e envia os dois PDFs.

Depois da publicação, faz `Ctrl + Shift + R` ou testa numa janela anónima.

## Comportamento corrigido

Se o cliente tiver email, o sistema exige o Welcome PDF atualizado e mostra uma mensagem clara caso o Vercel ainda esteja a servir o briefing antigo. Nunca utiliza o PDF interno como substituto e nunca envia as respostas internas para o cliente.

Se não existir email de cliente, o administrador pode receber o PDF interno sem que seja enviado um email ao cliente.
