FROM node:latest

COPY . /src

WORKDIR /src

RUN npm install

EXPOSE 8080

CMD ["node", "index.js"]
