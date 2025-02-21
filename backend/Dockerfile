FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE $PORT

CMD ["/bin/sh", "-c", "if [ \"$ENV\" = \"PRODUCTION\" ]; then npm run prod; else npm run dev; fi"]
