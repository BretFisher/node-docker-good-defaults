// simple node web server that displays hello world
// optimized for Docker image

var express = require('express');

// Constants
var PORT = 80;
// note we can set a fixed port here, because we actually control
// port from docker run command, and fix port 80 here and in Dockerfile

// App
var app = express();
app.get('/', function (req, res) {
  res.send('Hello Docker World\n');
});

var server = app.listen(PORT, function () {
  console.log('Webserver is ready');
});


//
// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
//

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', function onSigint () {
	console.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ', new Date().toISOString())
  shutdown()
});

// quit properly on docker stop
process.on('SIGTERM', function onSigterm () {
  console.info('Got SIGTERM. Graceful shutdown ', new Date().toISOString())
  shutdown()
})

// shut down server
function shutdown() {
  server.close(function onServerClosed (err) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
}
//
// need above in docker container to properly exit
//

