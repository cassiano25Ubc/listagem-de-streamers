# Streamers de xadrez

Aplicação React que reúne streamers de xadrez publicados pela API pública do Chess.com. Mostra username, avatar, status informado pela API, plataformas disponíveis e links para os canais.

> O Chess.com informa que os dados deste endpoint podem ser atualizados no máximo a cada 12 horas. O status exibido pode estar desatualizado e não representa necessariamente o estado em tempo real.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Instalação e desenvolvimento

```bash
npm install
npm run dev
```

## Comandos

```bash
npm run lint
npm run build
npm run preview
node --experimental-strip-types --test tests/streamersApi.test.ts
```

## Estrutura

```text
src/
  components/   Lista, cards de streamer e indicador de status
  hooks/        Carregamento, estados e atualização da lista
  services/     Consulta e normalização da API do Chess.com
  types/        Tipos normalizados de streamer e plataforma
tests/          Testes do serviço de integração com a API
public/.docs/   Brain dump, PRD e etapas do projeto
```

## Dados e atualização

A aplicação consulta `https://api.chess.com/pub/streamers` ao abrir, permite atualização manual e repete a consulta a cada 12 horas enquanto estiver aberta. O endpoint pode retornar mais de uma plataforma ou nenhuma; links só são habilitados quando existe uma URL HTTPS válida.
