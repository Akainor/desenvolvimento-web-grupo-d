# Colônia RPG - React + Express

Este projeto usa:
- **React + Vite** no frontend
- **Express** no backend
- persistência simples em `server/data/db.json`

## Como rodar

```bash
npm install
npm start
```

O comando acima sobe:
- frontend CRA em `http://localhost:3000`
- backend Express em `http://localhost:4000`

## O que foi movido para o backend

- salvamento e leitura das fichas
- atualização das fichas
- rolagens de dados
- histórico de rolagens

## Rotas da API

- `GET /api/characters`
- `POST /api/characters`
- `PUT /api/characters/:id`
- `DELETE /api/characters/:id`
- `GET /api/rolls`
- `POST /api/rolls`
- `DELETE /api/rolls`

## Observação

O frontend continua responsável pela interface, cálculos visuais da ficha e fluxo de criação.
