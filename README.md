# ALPHAFIT

Projeto academico.

## Stack

- Front-end: React + Vite + GSAP + ScrollTrigger
- Back-end: Node.js + TypeScript + Express
- Banco: SQLite + Sequelize
- Chatbot: Ollama local com o modelo `llama3.2:1b`
- Documentação: Swagger

## Como rodar

### 1. Verificar Ollama

O Ollama não precisa estar dentro da pasta do projeto. Ele roda como serviço local.

```bash
ollama list
```

Se aparecer `llama3.2:1b`, ok. Caso não apareça:

```bash
ollama pull llama3.2:1b
```

Teste:

```bash
ollama run llama3.2:1b
```

Se o Ollama não estiver ativo em segundo plano:

```bash
ollama serve
```

### 2. Rodar back-end

```bash
cd back-end
npm install
npm run dev
```

API:

```txt
http://localhost:3333
```

Swagger:

```txt
http://localhost:3333/api-docs
```

### 3. Criar dados iniciais

Em outro terminal:

```bash
cd back-end
npm run seed
```

Usuários de teste:

```txt
Admin: admin@alphafit.com / 123456
Aluno: aluno@alphafit.com / 123456
```

### 4. Rodar front-end

```bash
npm install
npm run dev
```

Front:

```txt
http://localhost:5173
```

## Banco real no DBeaver

Depois de rodar o back-end, o banco real será criado em:

```txt
back-end/database/alphafit.sqlite
```

No DBeaver:

1. Nova conexão
2. SQLite
3. Selecione `back-end/database/alphafit.sqlite`
4. Test Connection
5. Finish

Consultas úteis:

```sql
SELECT * FROM users;
SELECT * FROM chat_messages ORDER BY createdAt DESC;
SELECT * FROM exercises;
SELECT * FROM workout_plans;
```

Também deixei o script em:

```txt
back-end/database/alphafit.sql
back-end/docs/CONSULTAS_DBEAVER.sql
```

## Chatbot

O front chama:

```txt
POST http://localhost:3333/chat/message
```

O back-end chama o Ollama em:

```txt
http://localhost:11434/api/generate
```

Modelo usado:

```txt
llama3.2:1b
```

O prompt principal está em:

```txt
back-end/src/services/alphaPrompt.ts
```
