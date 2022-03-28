FROM node:lts-alpine as build-stage

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/. .
RUN npm run build

FROM node:lts-alpine as production-stage
WORKDIR /runner
COPY backend/package*.json ./
RUN npm install
COPY backend/index.js ./
COPY --from=build-stage /app/dist ./dist

EXPOSE 3000
CMD ["node", "index.js"]