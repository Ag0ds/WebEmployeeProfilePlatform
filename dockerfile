# ===== Base =====
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ===== Deps (instala apenas dependências) =====
FROM base AS deps
# se usar npm, cache padrão já ajuda
COPY package*.json ./
RUN npm ci

# ===== Build (gera JS) =====
FROM base AS build
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
RUN npm run build

# ===== Runtime (leve) =====
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=build /app/dist ./dist
COPY prisma ./prisma

# porta da API
EXPOSE 3000
CMD ["node", "dist/index.js"]
