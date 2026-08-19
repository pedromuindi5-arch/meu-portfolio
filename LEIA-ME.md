# Correção: nome do cliente em todos os briefings

## O que foi alterado

O `briefing.html` agora cria automaticamente um campo obrigatório **Nome do cliente** em todos os sete serviços:

- Branding
- Identidade Visual
- Social Media
- Flyer / Design Publicitário
- Evento / Design de Eventos
- Web Design
- Materiais Gráficos

O campo é comum a todos os serviços e não depende das perguntas configuradas no painel admin. Assim, mesmo que as perguntas de um serviço sejam alteradas, o nome continua disponível.

A pergunta antiga de nome da Identidade Visual é ocultada quando existe, para evitar que o cliente veja o mesmo campo duas vezes.

## Onde o nome aparece

O valor preenchido pelo cliente é usado automaticamente em:

1. capa do PDF do briefing recebido pelo administrador;
2. capa, página de boas-vindas e encerramento do Welcome Pack enviado ao cliente;
3. nome dos ficheiros PDF anexados ao email.

O valor também continua a ser guardado em `briefings.client_name` e no conjunto de respostas do briefing.

## Publicação

Substitui apenas o ficheiro `briefing.html` no projeto do Vercel. Não é necessário alterar o Google Apps Script nem executar nova migração no Supabase.

Depois do deployment:

1. abre `https://lucasmuindi.vercel.app/briefing.html`;
2. faz `Ctrl + Shift + R`;
3. testa pelo menos dois serviços diferentes;
4. confirma que o campo aparece antes das perguntas;
5. preenche um nome, submete e verifica o nome nos dois PDFs.

O campo é obrigatório. Se ficar vazio, o briefing não é enviado e aparece a mensagem para indicar o nome do cliente.

## Validação local

Foram validados os sete formulários, a obrigatoriedade do campo, a passagem do valor aos dois templates PDF, os campos `pdfBase64` e `welcomePdfBase64` e a exportação A4 determinística que corrige o corte lateral dos anexos.
