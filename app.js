var app = require('http');
var io = require('socket.io');
var ns = require('node-static'); // for serving files, jervis


var server = app.createServer(function(req, res) {
  req.addListener('end', function() {
    var ss = new ns.Server('./');
    ss.serve(req, res);     
  });
});

websock = io.listen(server);
server.listen(8080);

var userCount = 0;
var clients = {};

websock.sockets.on('connection', function (sock) {
  var conn = sock.handshake.address;
  if (!(conn.address in clients)) {
    if (Object.keys(clients).length > 1) {
      sock.emit('refuse'); 
    } else {
      clients[conn.address] = {'id': userCount++, 'x': 0, 'rot': 201, 'bullets': []};
      sock.broadcast.emit('join', clients[conn.address].id);
      console.log("Got a new connection from " + conn.address);
    }
  }

  // Accepts people in clients (new visitors added above)
  if (conn.address in clients) {
    sock.emit('accept', clients[conn.address].id, clients);
  }
  
  sock.on('update', function (x, rot, bullets) {
    client = clients[conn.address];
    client.x = x;
    client.rot = rot;
    client.bullets = bullets;
    sock.broadcast.emit('update', clients[conn.address]);
  });
});



