FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV PORT=3000
ENV HOST=127.0.0.1

EXPOSE 4000

CMD ["npm", "start"]