FROM node:latest

RUN mkdir -p /usr/src/app

# set our node environment, either development or production
# defaults to production
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# if you want to change port you should change both of these
ARG PORT=80
ENV PORT $PORT
EXPOSE $PORT

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK CMD curl -fs http://localhost:$PORT/healthz || exit 1

# install dependencies first, in a different location for easier app bind mount
WORKDIR /usr/src
COPY package.json /usr/src/
RUN npm install && npm cache clean
ENV PATH /data/node_modules/.bin:$PATH

# copy in our source code last
WORKDIR /usr/src/app
COPY . /usr/src/app

# if you want to use npm start instead, then use --init with docker run
# so that signals are passed properly
CMD [ "node", "index.js" ]
