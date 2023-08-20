FROM node:18.17.1-alpine3.17

WORKDIR /usr

COPY package.json ./
COPY tsconfig.json ./
COPY .env ./

COPY src ./src
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm","run","start"]