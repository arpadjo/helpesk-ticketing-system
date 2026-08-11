FROM node:22-alpine AS build

WORKDIR /app
RUN corepack enable
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN pnpm prisma:generate
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["sh", "-c", "pnpm prisma:generate && pnpm prisma:migrate:deploy && pnpm start"]
