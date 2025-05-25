FROM node:alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install
RUN apk add --update curl


EXPOSE 3000

CMD ["npm", "start"]