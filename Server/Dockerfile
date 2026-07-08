# Stage 1: Build the application
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# State 2: Create the production image
FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

USER node

COPY --from=build --chown=node:node /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/server.js"]

