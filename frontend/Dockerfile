FROM node:20-slim

WORKDIR /app

ENV ROLLUP_NO_NATIVE=true

COPY package*.json ./

RUN npm install --omit=optional --legacy-peer-deps

COPY . .

RUN npm install cross-env

RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]
