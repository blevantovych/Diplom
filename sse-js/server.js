const SSE = require('sse');
const redis = require("redis");
const http = require('http');
 
const redisClient = redis.createClient();

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

redisClient.subscribe('greetings')

const server = http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});

// to avoid cors error I added  'Access-Control-Allow-Origin': '*' in initialize function in file node_modules\sse\lib\sseclient.js 

server.listen(8085, '127.0.0.1', function() {
  var sse = new SSE(server);
  sse.on('connection', function(client) {
    console.log('new connection')
    redisClient.on('message', function(channel, message) {
      console.log(`channel: ${channel}, message: ${message}`)
      client.send(message);
    })
  });
});
