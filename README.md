# microservico-usuarios

Microsserviço responsável por autenticação, cadastro e perfis de usuários, incluindo controle de acesso por roles (RBAC) para biblioteca digital.

---

## Funcionalidades

- Cadastro e login de usuários com JWT
- Controle de roles hierárquico (`ADMIN`, `BIBLIOTECARIO_SENIOR`, `BIBLIOTECARIO_PLENO`, `USUARIO`, `ESTAGIARIO`)
- Endpoints protegidos via RBAC
- CRUD de usuários (exemplo: atualização, listagem para admins)
- Integração com Config Server e banco PostgreSQL via Sequelize
- Healthcheck e logs estruturados

---

## Como rodar localmente

### Pré-requisitos

- Node.js >= 18
- Docker (para banco/config server)
- `.env` configurado (veja `.env.example`)

### Usando Docker Compose (recomendado)

```sh
docker-compose up --build
```

### Manualmente (apenas API)

```sh
npm install
npm run dev
```

Observação: Certifique-se de que o PostgreSQL e o Config Server estão rodando e acessíveis.

---

## Endpoints principais

### Autenticação

- `POST /auth/register`  
  Registra novo usuário  
  Exemplo de corpo: `{ "name": "...", "email": "...", "password": "..." }`

- `POST /auth/login`  
  Retorna JWT válido  
  Exemplo de corpo: `{ "email": "...", "password": "..." }`

### Usuários

- `GET /users`  
  Lista usuários (apenas `ADMIN`)

- `PUT /users/:id`  
  Atualiza nome/role (ADMIN ou o próprio usuário)

- `GET /users/bibliotecarios`  
  Lista bibliotecários (ADMIN, BIBLIOTECARIO_SENIOR)

### Healthcheck

- `GET /health`  
  Retorna status do serviço e conexão ao banco

---

## Estrutura do projeto

```
.
├── app.js
├── config/           # Configurações e conexão ao banco/config server
├── docs/             # Documentação técnica, ADRs, diagramas (ver /docs)
├── middlewares/      # Middlewares de autenticação e autorização
├── models/           # Models Sequelize
├── routes/           # Rotas principais (auth, users)
├── service/          # Lógica de negócio
├── utils/            # Funções auxiliares
├── validators/       # Validação de payloads
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Documentação técnica

Decisões de arquitetura (ADRs), diagramas e contratos de API estão em [`/docs`](./docs/).

---

## Segurança

- JWT assinado (configure `JWT_SECRET` adequadamente)
- Hash de senha com bcrypt
- RBAC via middleware dedicado
- Nunca exponha seu `.env` ou segredos no versionamento
