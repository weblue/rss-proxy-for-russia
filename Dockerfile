FROM node:14-alpine as build-stage

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/. .
RUN npm run build

FROM node:14-alpine as production-stage
WORKDIR /runner
COPY backend/package*.json ./
RUN npm install
COPY backend/index.js ./
COPY --from=build-stage /backend/dist ./dist

EXPOSE 2096
CMD ["node", "index.js"]