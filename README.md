## Node + Docker Hello World, for Showing Good Defaults for Using Node.js in Docker

> This tries to be a "good defaults" example of using Node.js in Docker for local development and shipping to production with all the bells, whistles, and best practices. Issues/PR welcome.

### Features
- [x] Node express server
- [x] Preact ui server (for serving front end app)
- [x] MySQL as a DB.

### Local Development Features

 - **Dev as close to prod as you can**. docker-compose builds a local development image that is just like production image except for the below dev-only features needed in image. Goal is to have dev env be as close to test and prod as possible while still giving all the nice tools to make you a happy dev.
 - **Prevent needing node/npm on host**. Installs `node_modules` outside app root in container so local development won't run into a problem of bind-mounting over it with local source code. This means it will run `npm install` once on container build and you don't need to run npm on host or on each docker run. It will re-run on build if you change `package.json`.
 - **One line startup**. Uses `docker-compose up` for single-line build and run of local development server.
 - **Edit locally while code runs in container**. docker-compose uses proper bind-mounts of host source code into container so you can edit locally while running code in Linux container.
 - **Use nodemon in container**. docker-compose uses nodemon for development for auto-restarting node in container when you change files on host.
 - **Enable debug from host to container**. opens the legacy debug port 5858 and new inspect port 9229 for using host-based debugging like chrome tools or VS Code. Nodemon enables `--inspect` by default in docker-compose, but you can change to `--debug` for < 6.3 debugging.
 - **Provides VSCode debug config**. for Visual Studio Code fans, `.vscode` has a config for both `--debug` and `--inspect` node options.
 - **Small image and quick re-builds**. `COPY` in `package.json` and run `npm install && npm cache clean` **before** `COPY` in your source code. This saves big on build time and keep container lean.


### Production-minded Features

 - **Use Docker build-in healthchecks**. uses Dockerfile `HEALTHCHECK` with `/healthz` route to help Docker know if your container is running properly (example always returns 200, but you get the idea).
 - **Proper NODE_ENV use**. Defaults to `NODE_ENV=production` in Dockerfile and overrides to `development` in docker-compose for local dev.
 - **Don't add dev dependencies into production image**. Proper `NODE_ENV` use means dev dependencies won't be installed in container by default. Using docker-compose will build with them by default.
 - **Enables proper SIGTERM/SIGINT for graceful exit**. Defaults to `node index.js` rather then npm for allowing graceful shutdown of node. npm doesn't pass SIGTERM/SIGINT properly (you can't ctrl-c when running `docker run` in foreground). To get `node index.js` to graceful exit, extra signal-catching code is needed. The `Dockerfile` and `index.js` document the options and links to known issues.


### Assumptions

 - You have Docker and Docker-Compose installed (Docker for Mac, Docker for Windows, get.docker.com and manual Compose installed for Linux).
 - You want to use Docker for local development (i.e. never need to install node/npm on host) and have dev and prod Docker images be as close as possible.
 - You don't want to loose fidelity in your dev workflow. You want a easy environment setup, using local editors, node debug/inspect, local code repo, while node server runs in a container.
 - You use `docker-compose` for local development only (docker-compose was never intended to be a production deployment tool anyway).
 - The `docker-compose.yml` is not meant for `docker stack deploy` in Docker 1.13, it's meant for happy local development.


### Getting Started

If this was your Node.js app, to start local development you would:

 - Running `docker-compose up` is all you need. It will:
 - Build custom local image enabled for development (nodemon, `NODE_ENV=development`).
 - Start container from that image with ports 80, 5858, and 9229 open (on localhost).
 - Starts with `nodemon` to restart node on file change in host pwd.
 - Mounts the pwd to the app dir in container.
 - If you need other services like databases, just add to compose file and they'll be added to the custom Docker network for this app on `up`.
 - Compose should detect if you need to rebuild due to changed package.json or Dockerfile, but `docker-compose build` works for manually building.
 - Be sure to use `docker-compose down` to cleanup after your done dev'ing.

### MySQL shell access

 ```sh
 sudo docker exec -it mysql bash
 ```

 and

 ```sh
 mysql -u"$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD"
 ```

 #### Backup of database

 ```sh
 mkdir -p data/db/dumps
 ```

 ```sh
 source .env && sudo docker exec $(shell docker-compose ps -q mysqldb) mysqldump --all-databases -u"$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD" > "data/db/dumps/db.sql"
 ```

 or

 ```sh
 source .env && sudo docker exec $(shell docker-compose ps -q mysqldb) mysqldump test -u"$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD" > "data/db/dumps/test.sql"
 ```

 #### Restore Database

 ```sh
 source .env && sudo docker exec -i $(sudo docker-compose ps -q mysqldb) mysql -u"$MYSQL_ROOT_USER" -p"$MYSQL_ROOT_PASSWORD" < "data/db/dumps/db.sql"
 ```

MIT License,

Copyright (c) 2015-2017 Bret Fisher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
