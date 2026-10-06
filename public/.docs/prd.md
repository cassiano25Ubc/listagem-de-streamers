# PRD — Listagem de Streamers

**Status:** Proposta para o MVP — fonte aprovada com ressalva de atualidade  
**Versão:** 1.0  
**Data:** 06/10/2026  
**Base:** [`brain-dump.md`](./brain-dump.md)

## 1. Visão do produto

Uma aplicação web responsiva que apresenta streamers de xadrez em uma lista clara e atualizada. Para cada streamer, a interface deve exibir o nome de usuário, o avatar, o estado ao vivo ou offline, a plataforma de transmissão e um link para abrir a transmissão na plataforma correspondente.

> **Decisão de produto (06/10/2026):** manter a API do Chess.com no MVP e deixar explícito que o status exibido é o reportado pela API e pode estar desatualizado em até 12 horas. O produto não deve prometer status em tempo real. O intervalo de atualização da interface continua para ser definido na etapa de implementação, sem polling de 60 segundos como garantia de frescor.

## 2. Problema e objetivo

Encontrar rapidamente quem está transmitindo e acessar sua live exige consultar diferentes plataformas. O produto reúne essas informações em uma única tela, usando a API pública do Chess.com como fonte de dados.

### Objetivos do MVP

- Buscar os streamers na API pública do Chess.com.
- Exibir os dados essenciais de cada streamer em uma lista dinâmica.
- Distinguir visualmente o status ao vivo/offline reportado pela fonte, sem apresentá-lo como tempo real enquanto a fonte não garantir essa atualidade.
- Permitir abrir a página de transmissão quando houver uma URL válida.
- Comunicar estados de carregamento, lista vazia e falha de consulta.

### Indicadores de sucesso

- A lista é carregada a partir da API, sem depender de dados estáticos para o fluxo normal.
- Cada item disponível apresenta corretamente os dados fornecidos pela API.
- O status informado pela fonte é compreensível sem depender apenas da cor, e sua atualidade é comunicada de forma honesta.
- Falhas de rede ou respostas inválidas são comunicadas sem apresentar dados como se fossem atuais.

## 3. Público e necessidade principal

**Público primário:** pessoas que acompanham conteúdo de xadrez ao vivo e querem localizar rapidamente uma transmissão.

**Necessidade:** identificar quem está ao vivo, em qual plataforma, e acessar a transmissão com poucos passos.

## 4. Escopo

### Incluído no MVP

- Interface de página única em React.
- Lista dinâmica carregada do endpoint `https://api.chess.com/pub/streamers`.
- Nome de usuário e avatar, quando disponíveis.
- Indicador de estado ao vivo ou offline.
- Identificação da plataforma e link externo para a transmissão, quando disponíveis.
- Consulta dos dados ao abrir a página; política de atualização compatível com a frequência de atualização da fonte, a definir na implementação.
- Estados de carregamento, erro e ausência de resultados.
- Layout responsivo com fundo cinza-chumbo e painel de exibição com cantos arredondados.

### Fora do escopo inicial

- Cadastro, autenticação, perfis ou preferências persistentes.
- Pesquisa, filtros, ordenação e paginação.
- Notificações de início de transmissão.
- Agregação de dados de APIs de outras plataformas.
- Backend próprio, salvo se a validação técnica demonstrar que é necessário para contornar limitações de acesso à API.

## 5. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-01 | Ao iniciar, a aplicação deve consultar o endpoint público do Chess.com e carregar a lista de streamers. | Must |
| RF-02 | A lista deve ser renderizada a partir dos dados recebidos, sem conteúdo de streamer codificado diretamente na interface. | Must |
| RF-03 | Cada item deve exibir o username e o avatar disponíveis. Se o avatar não estiver disponível ou falhar ao carregar, deve ser usado um fallback visual acessível. | Must |
| RF-04 | Cada item deve indicar o status ao vivo/offline informado pela fonte com ponto verde ou cinza e texto ou nome acessível equivalente. A interface deve informar claramente que esse status pode estar desatualizado em até 12 horas e não sugerir atualidade em tempo real. | Must |
| RF-05 | Cada item deve identificar as plataformas disponíveis e disponibilizar um link para o canal ou transmissão quando houver URL válida. | Must |
| RF-06 | A aplicação deve consultar os dados ao abrir, permitir atualização manual e repetir a consulta a cada 12 horas enquanto estiver aberta. A periodicidade respeita a frequência documentada da fonte e não deve ser apresentada como garantia de status mais recente. | Should |
| RF-07 | Durante a consulta inicial, a interface deve apresentar um estado de carregamento. | Must |
| RF-08 | Se a consulta falhar, a interface deve informar que os dados não puderam ser atualizados e oferecer uma ação explícita para tentar novamente. | Must |
| RF-09 | Se a consulta for bem-sucedida, mas não houver streamers, a interface deve apresentar uma mensagem de lista vazia. | Must |
| RF-10 | Links de transmissão devem abrir em nova aba e usar proteções adequadas para links externos. | Must |

## 6. Requisitos de interface e experiência

- Usar fundo geral cinza-chumbo, com contraste suficiente para texto e controles.
- Apresentar a lista dentro de um painel com fundo próprio e bordas arredondadas.
- Manter avatar, username, estado e plataforma visualmente associados no item.
- Usar verde para “Ao vivo” e cinza para “Offline”, sempre complementando a cor com texto ou semântica acessível.
- Em telas estreitas, reorganizar ou quebrar o conteúdo sem cortar username, plataforma ou ações.
- Fornecer textos alternativos úteis para avatares; imagens decorativas devem ter alternativa vazia.
- Tornar links e ação de nova tentativa acessíveis por teclado, com foco visível.
- Respeitar a preferência do usuário por redução de movimento caso sejam adicionadas animações.

## 7. Requisitos não funcionais

- **Tecnologia:** React e TypeScript no projeto Vite existente.
- **Estado e efeitos:** usar `useState` para estado local da interface e `useEffect` para consulta e ciclo de atualização, conforme solicitado no brain dump.
- **Resiliência:** validar e normalizar a resposta antes de usá-la; ausência de campos opcionais não deve derrubar a lista.
- **Atualidade:** impedir que respostas antigas substituam dados de uma consulta mais recente e cancelar ou limpar o ciclo de atualização ao desmontar a tela.
- **Acessibilidade:** semântica HTML apropriada, nomes acessíveis para indicadores e links e contraste legível.
- **Manutenibilidade:** separar apresentação, acesso aos dados e tipos, mantendo a solução compatível com a estrutura já existente e sem introduzir dependências desnecessárias.
- **Segurança:** não renderizar conteúdo da API como HTML; validar URLs antes de criar links externos.

## 8. Dados e integração com a API

### Fonte

- **Endpoint:** `GET https://api.chess.com/pub/streamers`
- **Uso:** fonte principal para a lista e para os atributos de cada streamer.
- **Documentação geral:** [Chess.com Published-Data API](https://www.chess.com/news/view/published-data-api).

### Modelo interno proposto

```ts
type Streamer = {
  username: string
  avatarUrl: string | null
  isLive: boolean
  profileUrl: string | null
  platforms: Array<{
    type: string
    channelUrl: string | null
    streamUrl: string | null
    isLive: boolean | null
  }>
}
```

Esse é o modelo normalizado proposto. Os nomes da API são diferentes e devem ser mapeados por um adaptador: `avatar` para `avatarUrl`, `url` para `profileUrl`, `is_live` para `isLive` e `platforms[].type`, `channel_url`, `stream_url` e `is_live` para os campos da plataforma. A resposta pode não conter plataformas para todos os streamers; a lista deve aceitar `platforms: []`. `url` é o perfil do membro no Chess.com, não deve ser confundido com um endereço de canal ou transmissão.

### Resultado da validação — 06/10/2026

Consulta direta ao endpoint retornou **HTTP 200** e JSON com a propriedade raiz `streamers`. Na amostra observada foram recebidos 763 itens: todos continham `username`, `avatar`, `url` e `is_live` booleano; 32 estavam marcados como ao vivo e 731 como offline. Esses totais são apenas um retrato da consulta e podem mudar.

- Os campos observados incluem `username`, `avatar`, `twitch_url`, `url`, `is_live`, `is_community_streamer` e `platforms`.
- `platforms` pode conter mais de uma entrada, dos tipos observados `twitch` e `youtube`; também pode ser uma lista vazia. Na amostra, 253 itens não tinham plataformas listadas.
- Entradas de plataforma podem conter `channel_url`, `stream_url`, `is_live` e `is_main_live_platform`; esses campos não estão presentes em toda entrada. O `stream_url` não deve ser presumido para plataformas offline.
- A resposta observada incluiu `Access-Control-Allow-Origin: *`, portanto a chamada GET pode ser feita pelo navegador sem credenciais, sujeito a mudanças futuras no serviço.
- O cabeçalho de cache observado na consulta foi `Cache-Control: public, max-age=5`. A documentação geral da PubAPI alerta que os endpoints podem atualizar os dados em intervalos muito maiores e informa que este endpoint atualiza no máximo a cada 12 horas. O cache HTTP de cinco segundos não significa que os dados de origem sejam atualizados nesse intervalo.
- A documentação informa que requisições seriais não têm limite fixo de frequência, mas solicita lidar com `429 Too Many Requests`, que pode ocorrer em carga paralela. Consultas repetidas em intervalo curto não resolvem a limitação de atualização de origem.

**Impacto no produto:** a API confirma que há status, avatares, usernames e metadados de plataforma, mas não sustenta a expectativa de status em tempo real. O rótulo “Ao vivo” baseado nela pode estar desatualizado em até 12 horas. Para o MVP, foi decidido manter a API e comunicar essa ressalva na interface.

### Regras de integração

1. Tratar `is_live` como o status declarado pela API, não como prova de que a transmissão continua ao vivo no momento da visualização.
2. Exibir somente os atributos disponíveis; um username válido deve continuar utilizável mesmo que plataformas ou links estejam ausentes.
3. Não inferir status a partir da presença ou ausência de URL. Usar o campo de status explícito da fonte.
4. Permitir mais de uma plataforma por streamer e não criar link clicável quando uma URL estiver ausente ou for inválida.
5. Tratar erros HTTP, falhas de rede e respostas incompatíveis como falhas de consulta, sem apresentar uma resposta inválida como sucesso.
6. Não substituir `channel_url` por `stream_url` nem usar o perfil do Chess.com como se fosse link da plataforma.
7. Comunicar que o status é o reportado pela API e pode estar desatualizado em até 12 horas; não afirmar que representa o estado em tempo real.

### Política de atualização proposta

- Fazer uma consulta imediata ao montar a tela.
- Não adotar o intervalo de 60 segundos proposto anteriormente: ele não fornece status mais atual e cria requisições redundantes frente à atualização de origem no máximo a cada 12 horas.
- Repetir a consulta a cada 12 horas enquanto a tela estiver ativa e oferecer atualização manual.
- Essa periodicidade não garante que a resposta represente um status atualizado; a fonte pode entregar dados antigos.
- Limpar o temporizador ao desmontar a tela.
- A ação de tentar novamente deve disparar uma nova consulta.
- Se uma atualização implementada falhar, preservar os últimos dados válidos e indicar que a atualização falhou; na primeira consulta, mostrar o estado de erro sem uma lista fictícia.

## 9. Arquitetura proposta

Manter a arquitetura simples e alinhada ao React + TypeScript existente:

```text
src/
  App.tsx                 composição da página e estado da experiência
  components/
    StreamerList.tsx      renderização da coleção
    StreamerCard.tsx      apresentação de um streamer
    StatusIndicator.tsx   estado textual e visual ao vivo/offline
  hooks/
    useStreamers.ts       carregamento, atualização e estados da consulta
  services/
    streamersApi.ts       chamada HTTP, validação e normalização da resposta
  types/
    streamer.ts           modelo interno normalizado
  App.css                 layout e estilos da página/lista
  index.css               estilos globais e tokens visuais
```

Os diretórios acima são uma organização sugerida para o crescimento do MVP, não uma exigência de criar todos os arquivos antecipadamente. Reutilizar ou adaptar a estrutura atual quando ela já atender a essas responsabilidades.

### Fluxo de dados

1. `App` usa `useStreamers` para obter os dados e o estado da consulta.
2. `useStreamers` inicia a consulta, mantém o ciclo de atualização e expõe ação de nova tentativa.
3. `streamersApi` consulta o endpoint, valida o formato e converte cada entrada válida para `Streamer`.
4. `StreamerList` apresenta a lista, delegando cada item a `StreamerCard`.
5. `StreamerCard` mostra os dados disponíveis e usa `StatusIndicator` para comunicar o estado.

### Estados da tela

```text
initial loading -> success with items
                -> success empty
                -> initial error

success with items -> refreshing
                    -> updated success
                    -> stale data + refresh error
```

## 10. Critérios de aceitação

1. Ao abrir a aplicação, uma chamada ao endpoint inicia sem interação adicional.
2. Com uma resposta válida contendo streamers, a lista exibe os usernames e os demais atributos disponíveis.
3. O status reportado pela API é exibido por streamer com indicador visual e texto ou nome acessível correspondente, acompanhado de um aviso de que pode estar desatualizado em até 12 horas.
4. O nome da plataforma e o link aparecem quando fornecidos; campos ausentes não geram links quebrados nem impedem a renderização do item.
5. Avatares ausentes ou indisponíveis usam fallback sem quebrar o layout.
6. Enquanto a primeira consulta está pendente, o usuário vê um estado de carregamento.
7. Uma resposta válida sem itens resulta em mensagem de lista vazia.
8. Uma falha inicial resulta em mensagem de erro e ação funcional de nova tentativa.
9. Uma falha de atualização não apaga os últimos dados válidos e é comunicada ao usuário.
10. Links externos válidos abrem em nova aba com proteção contra acesso à página de origem.
11. A interface permanece utilizável em viewport móvel e por navegação via teclado.
12. Se houver atualização periódica, o ciclo deixa de executar quando a tela é desmontada.

## 11. Riscos, dependências e decisões pendentes

- **Frescor do status:** limitação aceita para o MVP. O endpoint apresenta status por streamer, mas a PubAPI documenta atualização dos dados no máximo a cada 12 horas; a interface deve comunicar essa ressalva e não afirmar que o status é em tempo real.
- **Plataforma e destino:** a resposta comporta várias plataformas por streamer e pode não listar nenhuma. Decidir a apresentação de múltiplos canais sem presumir que há transmissão ativa.
- **Cache e frequência:** o intervalo de consulta deve seguir a decisão sobre a fonte; polling a cada 60 segundos não torna os dados frescos.
- **Mudanças da API:** o contrato foi validado em 06/10/2026 e pode mudar; validar campos e status em tempo de execução.

## 12. Definição de pronto

- Status de “fonte aprovada com ressalva de atualidade” comunicado na interface e critérios Must compatíveis com essa decisão.
- Contrato da API selecionada confirmado e mapeamento documentado no código por tipos e validação.
- Experiência de carregamento, sucesso, lista vazia, erro e atualização com erro verificada.
- Layout responsivo e acessibilidade básica verificados.
- Build e lint existentes do projeto executados sem erros introduzidos pela entrega.
