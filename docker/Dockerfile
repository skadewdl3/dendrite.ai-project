FROM node:22-alpine AS base
WORKDIR /app
RUN apk add curl
RUN apk add python3
RUN apk add bash
RUN curl -fsSL https://bun.sh/install | BUN_INSTALL=/usr bash

FROM base AS install
COPY package.json bun.lockb ./
RUN bun install

FROM base AS prerelease
COPY --from=install node_modules node_modules
COPY . .

# Patch nextjs to enable websocket functionality
RUN bunx next-ws-cli@latest patch
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=prerelease /usr/src/app/.next ./.next
COPY --from=prerelease /usr/src/app/public ./public
COPY --from=prerelease /usr/src/app/package.json ./package.json
COPY --from=prerelease /temp/prod/node_modules ./node_modules

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
