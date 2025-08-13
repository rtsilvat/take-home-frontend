## Descrição

Frontend Next.js (App Router) com Material UI, React Query e AgGrid.

## Executando com Docker Compose

Pré-requisitos:
- Docker e Docker Compose instalados
- O `docker-compose.yml` está dentro do projeto do backend

Passo a passo (rodando a partir do diretório `take-home-backend`):

```bash
# Subir também o frontend
docker compose up -d --build frontend

# ou subir tudo (db, cache, backend e frontend)
docker compose up -d --build
```

URLs úteis:
- App: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/docs

## Variáveis de ambiente

Defina a base da API usando `NEXT_PUBLIC_HOST_API`.

Local (arquivo `.env.local` no diretório do frontend):

```bash
NEXT_PUBLIC_HOST_API=http://localhost:3001
```

No Docker Compose (já configurado no serviço `frontend` dentro do compose do backend):

```yaml
environment:
  NEXT_PUBLIC_HOST_API: http://localhost:3001
```

## Execução local (sem Docker)

```bash
npm install
npm run dev
# App em http://localhost:3000
```
