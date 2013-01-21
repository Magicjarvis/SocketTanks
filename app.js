var app = require('http');
var io = require('socket.io');
var ns = require('node-static'); // for serving files, jervis
var url = require('url');


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
  var query = url.parse(sock.handshake.headers.referer, true).query;
  var room = query.room || 'random';
  // var conn = sock.handshake.address;
  if (!(sock.id in clients)) {
    if (websock.sockets.clients(room).length > 1) {
      sock.emit('refuse'); 
    } else {
      clients[sock.id] = {'id': userCount++, 'x': 0, 'rot': 201, 'bullets': []};
      sock.broadcast.to(room).emit('join', clients[sock.id].id);
      console.log("Got a new connection with id: " + sock.id);
    }
  } else {
    sock.get('room', function (err, room) {
      console.log(sock.id + " Left room: " + room);
      sock.leave(room);
    });
  }

  // Accepts people in clients (new visitors added above)
  if (sock.id in clients) {
    sock.join(room);
    console.log(sock.id + " Joined room: " + room);
    sock.set('room', room);
    sock.emit('accept', clients[sock.id]);
  }
  
  sock.on('update', function (x, rot, bullets) {
    client = clients[sock.id];
    client.x = x;
    client.rot = rot;
    client.bullets = bullets;
    sock.get('room', function(err, room) {
      sock.broadcast.to(room).emit('update', clients[sock.id]);
    });
  });
});



