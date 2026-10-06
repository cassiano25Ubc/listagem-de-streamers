# ♟️ Streamers de Xadrez

Aplicação web desenvolvida em **React + TypeScript** que consome a API pública do **Chess.com** para listar streamers de xadrez e apresentar seus canais de transmissão de forma simples, organizada e responsiva.

A aplicação exibe informações como **username, avatar, status, plataformas disponíveis e links para os respectivos canais**.

## 🚀 Acesse o projeto

🔗  https://listagem-de-streamers.vercel.app/ 

> Substitua o link acima pela URL publicada do projeto, como Vercel, Netlify ou GitHub Pages.

---

## ✨ Funcionalidades

* ♟️ Lista de streamers disponíveis na API do Chess.com
* 👤 Exibição de username e avatar
* 🟢 Exibição do status informado pela API
* 📺 Identificação das plataformas disponíveis
* 🔗 Links diretos para os canais dos streamers
* 🔄 Atualização manual da lista
* ⏱️ Atualização automática a cada 12 horas
* 📱 Interface responsiva
* 🔒 Validação dos links HTTPS antes de habilitá-los
* ⚡ Estados de carregamento e atualização tratados pela aplicação

---

## 🛠️ Tecnologias utilizadas

* **React**
* **TypeScript**
* **Vite**
* **CSS**
* **API REST**
* **Chess.com Public API**
* **Node.js**
* **npm**

---

## 🌐 API utilizada

Os dados são obtidos através do endpoint público de streamers do Chess.com:

`https://api.chess.com/pub/streamers`

A aplicação é responsável por consultar os dados, normalizar as informações recebidas e transformá-las em dados utilizados pelos componentes da interface.

> **Importante:** o Chess.com informa que os dados desse endpoint podem ser atualizados no máximo a cada 12 horas. Por isso, o status apresentado pela aplicação pode estar desatualizado e não representa necessariamente o estado em tempo real do streamer.

---

## 📦 Requisitos

Antes de executar o projeto, certifique-se de possuir:

* **Node.js 20.19+ ou 22.12+**
* **npm**

---

## 💻 Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

Depois, execute o projeto em ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível na URL fornecida pelo Vite no terminal.

---

## 📋 Scripts disponíveis

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run lint
```

Executa a análise de código utilizando o ESLint.

```bash
npm run build
```

Gera a versão de produção da aplicação.

```bash
npm run preview
```

Executa uma prévia da versão de produção.

```bash
node --experimental-strip-types --test tests/streamersApi.test.ts
```

Executa os testes do serviço responsável pela integração com a API.

---

## 📁 Estrutura do projeto

```text
src/
├── components/
│   └── Lista, cards de streamer e indicador de status
│
├── hooks/
│   └── Carregamento, estados e atualização da lista
│
├── services/
│   └── Consulta e normalização da API do Chess.com
│
└── types/
    └── Tipos de streamer e plataforma

tests/
└── Testes do serviço de integração com a API

public/
└── .docs/
    └── Brain dump, PRD e etapas do projeto
```

---

## 🔄 Dados e atualização

Ao abrir a aplicação, uma consulta é realizada ao endpoint do Chess.com.

O usuário também pode solicitar uma **atualização manual** dos dados.

Além disso, enquanto a aplicação estiver aberta, uma nova consulta é realizada automaticamente a cada **12 horas**, acompanhando o período de atualização informado pela API.

A aplicação também trata diferentes situações retornadas pelo endpoint, incluindo:

* Streamer com uma plataforma
* Streamer com múltiplas plataformas
* Streamer sem plataforma disponível
* Links inválidos ou que não utilizam HTTPS

Links de canais somente são disponibilizados quando existe uma URL HTTPS válida.

---

## 🧪 Testes

O projeto possui testes para o serviço responsável pela integração com a API.

Para executá-los:

```bash
node --experimental-strip-types --test tests/streamersApi.test.ts
```

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido como prática de desenvolvimento frontend utilizando **React e TypeScript**, com foco em:

* Consumo de API REST
* Organização de componentes
* Criação de hooks personalizados
* Tipagem com TypeScript
* Tratamento de estados
* Validação e normalização de dados
* Testes de integração
* Desenvolvimento de uma interface responsiva

---

## 👨‍💻 Desenvolvido por

**Cassiano Maia**

Estudante de Ciência da Computação e desenvolvedor em formação, com foco em desenvolvimento web.

[GitHub](https://github.com/cassiano25Ubc)
