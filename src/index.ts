// simple node web server that displays hello world
// optimized for Docker image

import * as express from 'express'
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

import * as morgan from 'morgan'
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

import * as client from 'knex'

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

class App {
  public express
  public connection
  private server

  constructor () {
    this.express = express()
    this.express.use(morgan('common'));
    this.connection = this.initConnection()
    this.mountRoutes()
    this.server = this.express.listen(PORT, HOST, () => {
      console.log(`Webserver is ready at ${HOST}:${PORT}`);
    });

    //
    // need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
    // this also won't work on using npm start since:
    // https://github.com/npm/npm/issues/4603
    // https://github.com/npm/npm/pull/10868
    // https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
    // if you want to use npm then start with `docker run --init` to help, but I still don't think it's
    // a graceful shutdown of node process
    //

    // quit on ctrl-c when running docker in terminal
    process.on('SIGINT', () => {
      console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString());
      this.shutdown();
    });

    // quit properly on docker stop
    process.on('SIGTERM', () => {
      console.info('Got SIGTERM (docker container stop). Graceful shutdown ', new Date().toISOString());
      this.shutdown();
    });

    //
    // need above in docker container to properly exit
    //
  }

  private initConnection (): client {
    return client({
      client: 'mysql',
      connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
      }
    })
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', function (req, res) {
      res.send('Hello Docker World\n');
    });

    router.get('/healthz', function (req, res) {
      // do app logic here to determine if app is truly healthy
      // you should return 200 if healthy, and anything else will fail
      // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
      res.send('I am happy and healthy\n');
    });
    this.express.use('/', router)
  }

  private shutdown (): void {
    this.server.close((err) => {
      if (err) {
        console.error(err);
        process.exitCode = 1;
      }
      process.exit();
    });
  }
}

export default new App().express
