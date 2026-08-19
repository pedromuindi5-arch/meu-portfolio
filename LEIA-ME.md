# Correção do erro RLS no envio móvel do briefing

## Causa

A tabela `briefings` já permitia inserções públicas, mas o `briefing.html` fazia `.insert(...).select().single()`. Esse `select()` exigia uma política de leitura pública que não deve existir. O código também tentava fazer um `UPDATE` público depois do upload dos anexos, embora a tabela não permita UPDATE anónimo.

## Correção

O `briefing.html` corrigido gera o UUID do briefing no navegador e faz o INSERT sem pedir a linha de volta. Os nomes dos anexos são incluídos no `form_data` antes do INSERT e o UPDATE público foi removido. Os anexos continuam associados ao mesmo UUID.

## Publicação

Substitui apenas o ficheiro `briefing.html` no projeto que está ligado ao Vercel. Não alteres o `Code.gs`, não executes nova migração e não cries políticas públicas de SELECT ou UPDATE.

Depois do deployment:

1. Abre o briefing no telemóvel.
2. Faz uma atualização completa da página ou abre uma janela privada.
3. Escolhe um serviço.
4. Preenche o nome do cliente e as perguntas.
5. Submete sem anexos.
6. Repete, se necessário, com um ficheiro de referência.

O administrador deve receber o PDF do briefing e, quando houver email de cliente, o cliente deve receber apenas o Welcome Pack.

## Validação local

O JavaScript embutido foi validado. O fluxo corrigido já não contém `.select()` ou `.update()` na operação pública de `briefings`.
