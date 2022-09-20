# Node.js + Docker for Showing Good Defaults in Using Node.js with Docker

[![Lint Code Base](https://github.com/BretFisher/node-docker-good-defaults/actions/workflows/call-super-linter.yaml/badge.svg)](https://github.com/BretFisher/node-docker-good-defaults/actions/workflows/call-super-linter.yaml)
[![Docker Build](https://github.com/BretFisher/node-docker-good-defaults/actions/workflows/call-docker-build.yaml/badge.svg)](https://github.com/BretFisher/node-docker-good-defaults/actions/workflows/call-docker-build.yaml)

> This tries to be a "good defaults" example of starting to use Node.js in Docker for local development and shipping to production with basic bells, whistles, and best practices. Issues/PR welcome.

**Note** I have more advanced examples of Node.js Dockerfiles and Compose files in my [DockerCon 2022 talk and repository](https://github.com/BretFisher/nodejs-rocks-in-docker).
I also have more about everything Docker and Node.js in my 8 hour video course [Docker for Node.js](https://www.bretfisher.com/node/).

**Also Note**, I have other resources on [Docker and Kubernetes here](https://www.bretfisher.com/docker).

## Local Development Features

- **Dev as close to prod as you can**.
Docker Compose builds a local development image that is just like the production image except for the
below dev-only features needed in the image.
The goal is to have dev environment be as close to test and prod as possible while still giving all the
nice tools to make you a happy dev.
- **Prevent needing node/npm on host**.
This installs `node_modules` outside app root in the container image so local development won't run into a
problem of bind-mounting over it with local source code. This means it will run `npm install`
once on container build and you don't need to run npm on host or on each docker run.
It will re-run on build if you change `package.json`.
- **One line startup**. Uses `docker compose up` for single-line build and run of local
development server.
- **Edit locally while code runs in container**.
Docker Compose uses proper bind-mounts of host source code into container so you can edit
locally while running code in Linux container.
- **Use nodemon in container**. Docker Compose uses nodemon for development for auto-restarting
Node.js in container when you change files on host.
- **Enable debug from host to container**. Opens the inspect port 9229 for using host-based
debugging like chrome tools or VS Code. Nodemon enables `--inspect` by default in Docker Compose.
- **Provides VSCode debug configs and tasks for tests**. for Visual Studio Code fans,
`.vscode` directory has the goods, thanks to @JPLemelin.
- **Small image and quick re-builds**. `COPY` in `package.json` and run `npm install`
**before** `COPY` in your source code. This saves big on build time and keeps the container image lean.
- **Bind-mount package.json**. This allows adding packages in realtime without rebuilding images. e.g.
`docker compose exec -w /opt/node_app node npm install --save <package name>`

## Production-minded Features

- **Use Docker built-in healthchecks**. This uses Dockerfile `HEALTHCHECK` with `/healthz` route to
help Docker know if your container is running properly (example always returns 200, but you get the idea).
- **Proper NODE_ENV use**. Defaults to `NODE_ENV=production` in Dockerfile and overrides to
`development` in docker-compose for local dev.
- **Don't add dev dependencies into the production image**. Proper `NODE_ENV` use means dev dependencies
won't be installed in the image by default. Using Docker Compose will build with them by default.
- **Enables proper SIGTERM/SIGINT for graceful exit**. Defaults to `node index.js` rather than npm
for allowing graceful shutdown of node.
npm doesn't pass SIGTERM/SIGINT properly (you can't ctrl-c when running `docker run` in foreground).
To get `node index.js` to graceful exit, extra signal-catching code is needed.
The `Dockerfile` and `index.js` document the options and links to known issues.
- **Run Node.js in the container as `node` user, not `root`**.
- **Use docker-stack.yml example for Docker Swarm deployments**.

## Assumptions

- You have Docker and Docker Compose installed (Docker Desktop for Mac/Windows/Linux).
- You want to use Docker for local development (i.e. never need to install Node.js/npm on host)
and have dev and prod Docker images be as close as possible.
- You don't want to lose fidelity in your dev workflow. You want a easy environment setup,
using local editors, Node.js debug/inspect, local code repository, while Node.js server runs in a container.
- You use `docker-compose` for local development only (docker-compose was never intended to be
a production deployment tool anyway).
- The `docker-compose.yml` is not meant for `docker stack deploy` in Docker Swarm,
it's meant for happy local development. Use `docker-stack.yml` for Swarm.

## Getting Started

If this was your Node.js app, to start local development you would:

- Running `docker compose up` is all you need. It will:
- Build custom local image enabled for development (nodemon, `NODE_ENV=development`).
- Start container from that image with ports 80 and 9229 open (on localhost).
- Starts with `nodemon` to restart Node.js on file change in host pwd.
- Mounts the pwd to the app dir in container.
- If you need other services like databases,
just add to compose file and they'll be added to the custom Docker network for this app on `up`.
- Compose won't rebuild automatically, so either run `docker compose build` after changing `package.json`
or do what I do and always run `docker compose up --build`.
- Be sure to use `docker compose down` to cleanup after your done dev'ing.

If you wanted to add a package while docker-compose was running your app:

- `docker compose exec -w /opt/node_app node npm install --save <package name>`
- This installs it inside the running container.
- Nodemon will detect the change and restart.
- `--save` will add it to the package.json for next `docker compose build`

To execute the unit-tests, you would:

- Execute `docker compose exec node npm test`, It will:
- Run a process `npm test` in the container.
- You can use the *vscode* to debug unit-tests with config `Docker Test (Attach 9230 --inspect)`,
It will:
  - Start a debugging process in the container and wait-for-debugger, this is done by *vscode tasks*
  - It will also kill a previous debugging process if existing.

## Ways to improve security

### Run Node.js as Non-Root User

As mentioned in the official docker Node.js image docs, Docker runs the image as root.
This can pose a
[potential security issue](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user).

As a security best practice, it is recommended for Node.js apps to listen on non-privileged ports
[as mentioned here](https://github.com/i0natan/nodebestpractices/blob/master/sections/security/non-root-user.md).

## Other Resources

- [https://blog.hasura.io/an-exhaustive-guide-to-writing-dockerfiles-for-node-js-web-apps-bbee6bd2f3c4](https://blog.hasura.io/an-exhaustive-guide-to-writing-dockerfiles-for-node-js-web-apps-bbee6bd2f3c4)
