# Plano de execução — Listagem de Streamers

Roteiro de implementação baseado no [PRD](./prd.md). As etapas devem ser executadas **em sequência, uma por vez**. Não iniciar uma nova etapa antes de concluir e validar os critérios de saída da etapa atual.

## Como acompanhar

- Marque cada tarefa como concluída somente depois de verificar o resultado.
- Mantenha apenas uma etapa como `EM ANDAMENTO`.
- Se um critério não puder ser atendido, registre o bloqueio na etapa e ajuste o PRD antes de continuar.
- Ao terminar uma etapa, atualize o status e a data; então comece a próxima.
- Não avance com dados presumidos da API nem esconda falhas de integração com dados fictícios.

**Etapa atual:** Concluído  
**Status geral:** MVP verificado; todas as etapas concluídas  
**Última atualização:** 06/10/2026

## Etapa 1 — Validar a API e as premissas

**Status:** CONCLUÍDA  
**Objetivo:** confirmar que a fonte escolhida fornece os dados que o produto promete exibir.

- [x] Consultar `https://api.chess.com/pub/streamers` e registrar a estrutura real da resposta no PRD.
- [x] Confirmar se a resposta inclui username e avatar.
- [x] Confirmar se existe campo de status ao vivo/offline; o frescor limitado desse status também foi registrado.
- [x] Confirmar que a API informa uma lista opcional de plataformas e URLs de canal/transmissão; múltiplas plataformas foram observadas.
- [x] Verificar HTTP 200, `Access-Control-Allow-Origin: *`, cabeçalhos de cache e recomendações documentadas de frequência/429.
- [x] Comparar os campos reais com o modelo `Streamer` e atualizar as regras da seção 8 do PRD.
- [x] Atualizar o PRD diante da limitação encontrada e decidir a fonte/escopo antes de implementar a interface.

**Critério de saída:** contrato e limitações documentados; fonte e escopo decididos antes de implementar a interface.

**Validação técnica:** HTTP 200; amostra de 763 streamers, todos com username, avatar, URL de perfil e booleano `is_live`; tipos de plataforma observados: Twitch e YouTube. 253 itens da amostra não tinham plataforma listada. Contagens são um retrato da consulta e podem mudar.

**Decisão registrada:** manter a API do Chess.com e comunicar que o status exibido é o informado pela API, podendo estar desatualizado em até 12 horas. Não prometer status em tempo real. O polling de 60 segundos foi removido; a atualização a cada 12 horas e a ação manual foram definidas e implementadas na Etapa 4.

## Etapa 2 — Preparar a aplicação React

**Status:** CONCLUÍDA  
**Objetivo:** remover a experiência de demonstração do template e estabelecer a estrutura mínima do produto.

- [x] Remover da tela principal os elementos de demonstração do Vite/React e o contador.
- [x] Definir a composição inicial da página de listagem em `App.tsx`.
- [x] Manter a estrutura mínima atual; criar pastas de serviço/componentes somente nas etapas em que forem necessárias.
- [x] Manter os scripts e dependências existentes, sem adicionar pacotes desnecessários.
- [x] Executar lint e build para verificar a base antes de adicionar integração.

**Critério de saída:** a aplicação abre sem a tela padrão do template; lint e build passam.

**Validação:** `npm run lint` e `npm run build` passaram. A página servida pelo Vite foi conferida no navegador e apresenta o esqueleto da listagem, sem a tela padrão do template.

**Escopo mantido:** nenhuma chamada à API, modelagem de dados ou integração foi implementada nesta etapa.

## Etapa 3 — Modelar e integrar os dados

**Status:** CONCLUÍDA  
**Objetivo:** implementar acesso à API com tipos e validação baseados no contrato confirmado na Etapa 1.

- [x] Definir o tipo `Streamer` normalizado conforme os campos que a API realmente fornece.
- [x] Implementar em `services/streamersApi.ts` a consulta HTTP ao endpoint.
- [x] Validar o formato da resposta e mapear os campos reais para o modelo interno.
- [x] Tratar erros HTTP, falhas de rede e respostas inesperadas como erros explícitos.
- [x] Validar URLs externas e normalizar URLs ausentes/inseguras como `null`, sem criar destino clicável.
- [x] Testar o mapeamento com resposta real, múltiplas plataformas, campos opcionais ausentes, URLs inseguras e erros de consulta.

**Critério de saída:** serviço retorna dados tipados e normalizados, ou informa uma falha real sem transformar resposta inválida em sucesso.

**Validação:** `node --experimental-strip-types --test tests/streamersApi.test.ts` (6 testes aprovados); `npm run lint` e `npm run build` aprovados. Uma consulta real também foi normalizada pelo serviço com sucesso.

**Escopo mantido:** o serviço ainda não está ligado à tela; carregamento, estados de interface e atualização ficam para a Etapa 4.

## Etapa 4 — Implementar carregamento e atualização

**Status:** CONCLUÍDA  
**Objetivo:** controlar consulta inicial, atualização periódica, nova tentativa e preservação dos últimos dados válidos.

- [x] Criar `hooks/useStreamers.ts` usando `useState` e `useEffect`.
- [x] Consultar os dados ao montar a tela.
- [x] Implementar estados distintos para carregamento inicial, sucesso, lista vazia e erro inicial.
- [x] Adicionar ação de nova tentativa que inicia uma consulta.
- [x] Implementar atualização periódica a cada 12 horas e atualização manual, sem tratar o intervalo como garantia de frescor.
- [x] Limpar temporizador e cancelar ou ignorar consultas obsoletas ao desmontar/atualizar.
- [x] Em falha de atualização, manter os últimos dados válidos e sinalizar que a atualização falhou.

**Critério de saída:** todos os estados e transições previstos no PRD são representáveis e o ciclo não continua após desmontar o componente.

**Validação:** resposta real carregada no navegador; respostas vazias mostram estado vazio; erro HTTP inicial permite tentar novamente; erro durante atualização mantém os dados anteriores. `node --experimental-strip-types --test tests/streamersApi.test.ts` (6 testes aprovados), `npm run lint` e `npm run build` aprovados.

**Arquivos principais:** `src/hooks/useStreamers.ts`, integração dos estados em `src/App.tsx` e botão/avisos de atualização em `src/App.css`. A política de 12 horas também foi registrada no PRD.

**Escopo mantido:** os itens/cards visuais continuam para a Etapa 5.

## Etapa 5 — Construir a lista e os itens

**Status:** CONCLUÍDA  
**Objetivo:** apresentar os dados em componentes pequenos e consistentes.

- [x] Criar `StreamerList.tsx` para renderizar a coleção recebida.
- [x] Criar `StreamerCard.tsx` para username, avatar, plataforma e link disponíveis.
- [x] Criar `StatusIndicator.tsx` para comunicar “Ao vivo” ou “Offline” visual e textualmente.
- [x] Usar username normalizado como chave estável na renderização da lista.
- [x] Exibir fallback acessível quando o avatar estiver ausente ou falhar.
- [x] Não mostrar link clicável quando a API não fornecer um destino HTTPS válido.
- [x] Integrar o componente de lista à página e conectá-lo aos dados, estados e ação de nova tentativa fornecidos pelo hook.

**Critério de saída:** a lista renderiza os dados dinâmicos e os estados vazios/opcionais não quebram os itens.

**Validação:** interface conferida no navegador com dados simulados de streamers ao vivo/offline, múltiplas plataformas, avatar ausente/URL insegura e streamer sem plataforma. Os links externos usam nova aba com proteções. `npm run lint`, `npm run build` e os 6 testes da API passaram.

**Arquivos principais:** `src/components/StreamerList.tsx`, `src/components/StreamerCard.tsx`, `src/components/StatusIndicator.tsx`, `src/App.tsx` e `src/App.css`.

## Etapa 6 — Aplicar estilo responsivo e acessível

**Status:** CONCLUÍDA  
**Objetivo:** substituir os estilos do template pela identidade e experiência definidas no PRD.

- [x] Definir fundo geral cinza-chumbo e painel de exibição com cantos arredondados.
- [x] Aplicar hierarquia visual clara para título, lista, estado e plataforma.
- [x] Usar ponto verde para ao vivo e ponto cinza para offline, acompanhado de texto acessível.
- [x] Garantir que a lista se adapte a telas estreitas sem cortar conteúdo ou ações, inclusive usernames/plataformas longos.
- [x] Conferir contraste, foco visível, ordem de teclado e textos alternativos dos avatares.
- [x] Garantir que links externos abram em nova aba com `rel="noopener noreferrer"` e informem essa ação a leitores de tela.
- [x] Remover estilos e regras do template que não sejam mais usados.

**Critério de saída:** a tela é utilizável em viewport móvel e por teclado, com os requisitos visuais e acessíveis do PRD atendidos.

**Validação:** interface verificada em larguras de 320, 375, 600, 768 e 1280 px sem overflow horizontal; link de pular para a lista acessível por Tab; foco visível e rótulos/links verificados. Contraste da cor secundária: 6,25:1 no fundo e 5,54:1 no painel. `npm run lint` e `npm run build` passaram.

**Arquivos principais:** `src/App.css`, `src/index.css`, `src/App.tsx`, `src/components/StreamerCard.tsx` e `index.html` (idioma, título e metadados).

## Etapa 7 — Verificar o MVP ponta a ponta

**Status:** CONCLUÍDA  
**Objetivo:** conferir critérios de aceitação e preparar a entrega.

- [x] Verificar consulta inicial com resposta válida contendo streamers.
- [x] Verificar resposta válida vazia.
- [x] Verificar erro inicial e funcionamento da nova tentativa.
- [x] Verificar campos opcionais ausentes, avatar indisponível e URL inválida.
- [x] Verificar falha durante atualização sem apagar os últimos dados válidos.
- [x] Verificar comportamento de status ao vivo/offline apenas com sinais confirmados pela API.
- [x] Verificar intervalo de atualização de 12 horas, limpeza do temporizador no `useEffect` e cancelamento/ignorância de requisições ao desmontar.
- [x] Executar `npm run lint`.
- [x] Executar `npm run build`.
- [x] Corrigir regressões introduzidas e confirmar alinhamento entre comportamento e PRD.

**Critério de saída:** critérios de aceitação do PRD verificados e lint/build concluídos sem erros introduzidos.

**Validação ponta a ponta:** navegador carregou 764 streamers da API real, com status reportado de 33 ao vivo e 731 offline na consulta; os totais variam conforme a fonte. Cenários controlados confirmaram lista vazia, recuperação após HTTP 503, preservação dos dados após HTTP 429 durante atualização, fallback para avatar indisponível, URLs HTTP descartadas, itens sem plataforma e links HTTPS com proteção de nova aba. O aviso de possível desatualização aparece na página.

**Validação técnica:** 6 testes da API passaram; `npm run lint` e `npm run build` passaram. O intervalo de atualização e o cleanup/cancelamento no ciclo de vida do hook foram conferidos.

**Resultado:** nenhuma divergência que exigisse nova alteração de implementação foi encontrada na verificação final.

## Registro de bloqueios e decisões

| Etapa | Bloqueio ou decisão | Resolução | Data |
|---|---|---|---|
| 1 | O endpoint fornece `is_live`, mas os dados podem estar desatualizados em até 12 horas. | Decisão do produto: manter a API do Chess.com no MVP e informar claramente a limitação; não apresentar o status como tempo real. | 06/10/2026 |
| 1 | A resposta pode incluir várias plataformas ou nenhuma, e os URLs de transmissão podem estar ausentes. | Modelar plataformas como lista opcional; apresentar todas as informadas e não criar link clicável sem URL HTTPS válida. | 06/10/2026 |
| 1 / 4 | Polling a cada 60 segundos não torna atuais dados de origem que podem mudar apenas a cada 12 horas. | Remover o intervalo de 60 segundos; consultar ao abrir, permitir atualização manual e repetir a consulta a cada 12 horas, sem prometer frescor. | 06/10/2026 |
| 3 / 4 | Falhas HTTP/rede e respostas inválidas não podem parecer consultas bem-sucedidas; uma falha de atualização não deve descartar dados ainda utilizáveis. | Serviço informa erros explicitamente; a interface permite nova tentativa e mantém os últimos dados válidos em falha de atualização. | 06/10/2026 |
| 5 / 6 | Avatares podem falhar e dados opcionais não devem impedir a leitura dos outros campos. | Usar fallback de avatar, mostrar streamers sem plataformas e manter nomes de plataforma sem link quando não houver destino seguro. Interface responsiva e navegável por teclado. | 06/10/2026 |
| 7 | Nenhum bloqueio restante após as verificações ponta a ponta. | Cenários funcionais, lint e build verificados; MVP registrado como concluído. | 06/10/2026 |
