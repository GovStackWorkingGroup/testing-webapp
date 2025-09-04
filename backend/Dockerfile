# -----------------------------------------------------------------------------+
# Build container
# -----------------------------------------------------------------------------+
FROM node:22.8.0 AS build

# Build code
WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --pure-lockfile

COPY ./src/ src/
COPY ./server.ts ./
COPY ./@types/ @types/
COPY ./tsconfig.json ./

ENV NODE_ENV production

RUN yarn run build

# -----------------------------------------------------------------------------+
# Runtime container
# -----------------------------------------------------------------------------+
FROM node:22.8.0

WORKDIR /app

ENV NODE_ENV production

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
