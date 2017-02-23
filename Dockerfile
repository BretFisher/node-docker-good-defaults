FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# set our node environment, either development or production
# defaults to production
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# if you want to change port you should change both of these
ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT

# install dependencies first
COPY package.json /usr/src/app/
RUN npm install && npm cache clean

# copy in our source code last
COPY . /usr/src/app

CMD [ "node", "index.js" ]
