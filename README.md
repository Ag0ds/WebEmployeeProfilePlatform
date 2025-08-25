# WebEmployeeProfilePlatform
# 1) clone
git clone <SEU_REPO>.git
cd <SEU_REPO>

# 2) crie o .env.docker a partir do exemplo
cp .env.example .env.docker
# edite .env.docker e confirme DATABASE_URL com host "db" e porta 5432

# 3) suba o banco
docker compose up -d db

# 4) build da API
docker compose build api

# 5) migrar e fazer seed (dentro do container)
docker compose run --rm api sh -lc "npx prisma migrate deploy && npx prisma db seed"

# 6) subir a API
docker compose up -d api

# 7) healthcheck
curl http://localhost:3000/health
