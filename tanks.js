(function () {
  var canvas = document.getElementById('tanksCanvas');
  // TODO(jarv): security
  var socket = io.connect('192.168.1.108'); // We need to change. Host on heroku? 
  stage = new Stage(canvas);
  
  tank = null;
  var healthMessage;
  var holdingSpacebar = false;
  var currentBullet;
  var id;
  bullets = [];
  bulletCount = 0;
  opponent = {'tank': null, 'bullets': null};

  socket.on('accept', function (self) {
    // We're in! Draw tank and health on stage. Save id.
    id = self.id;
    console.log('your tank id is: ' + self.id);
    tank = new Tank(0, canvas.height); 
    tank.x = self.x;
    stage.addChild(tank);
    healthMessage = new Text("Your Health: "+tank.hp,"bold 24px Arial", "#000");
    stage.addChild(healthMessage);
    stage.update();
  }); 

  socket.on('refuse', function () {
    alert("Sorry, too many players!"); 
    return;
  })

  socket.on('join', function (id) {
    // Another tank has joined!
    var clientTank = new Tank(0, canvas.height);
    opponent.tank = clientTank;
    stage.addChild(clientTank);
    stage.update();
    console.log(id + ' has joined!'); 
  });


  proc = {};
  var processBullets = function (bullets) {
    var keyMap = {};
    for (p in proc) {
      keyMap[p] = false; 
    }
    bullets.forEach(function (b) {
      if (!proc[b.id]) {
        proc[b.id] = new Bullet();
        stage.addChild(proc[b.id]);
        proc[b.id].fire(b.x, b.y, 0); // just draws because not ticking (used as dataholder)
      } else {
        keyMap[b.id] = true;
        proc[b.id].x = b.x; 
        proc[b.id].y = b.y; 
      }
      var pt = tank.globalToLocal(b.x, b.y);
      if (tank.hitTest(pt.x, pt.y)) {
        tank.takeHit(1); 
      }
    });
    for (key in keyMap) {
      if (!keyMap[key]) {
        stage.removeChild(proc[key]); 
        delete proc[key];
      } 
    }
    return proc;// this shouldn't be here
  };
  socket.on('update', function (c) {
    if (c.id == id) {
      // If update from self (different tab?), update self
      tank.x = c.x;
      tank.gun.rotation = c.rot;
    } else {
      if (!opponent.tank) {
        // If update from unseen opponent. Create opponent
        opponent.tank = new Tank(c.x, canvas.height);
        stage.addChild(opponent.tank);
      }
      opponent.tank.x = c.x;
      opponent.tank.gun.rotation = c.rot;
      opponent.bullets = processBullets(c.bullets);
    }
    stage.update();
  });

  var KEY_A_DOWN = false;
  var KEY_D_DOWN = false;
  var KEY_LEFT_DOWN = false;
  var KEY_RIGHT_DOWN = false;
  var KEY_SPACE_DOWN = false;

  var handleKeyAction = function (down) {
    return function (e) {
      if (!e) {
        e = window.event; 
      } 
      switch (e.keyCode) {
        case 65: KEY_A_DOWN = down; break;
        case 68: KEY_D_DOWN = down; break;
        case 37: KEY_LEFT_DOWN = down; break;
        case 39: KEY_RIGHT_DOWN = down; break;
        case 32: KEY_SPACE_DOWN = down; break;
        default: console.log('What are you doing, jervis?');
      }
    } 
  }

  var makeBullet = function () {
    var b = new Bullet();
    stage.addChild(b);
    bullets.push(b);
    b.id = bulletCount++;
    return b;
  }
  function tick () {
    if (KEY_A_DOWN) {
      tank.left();    
    } else if (KEY_D_DOWN) {
      tank.right(); 
    }

    if (KEY_LEFT_DOWN) {
      tank.gunLeft(); 
    } else if (KEY_RIGHT_DOWN) {
      tank.gunRight(); 
    }

    if (KEY_SPACE_DOWN) {
      if (!currentBullet) {
        currentBullet = makeBullet();
      }
      currentBullet.increasePower();
      tank.gunCharge();
      holdingSpacebar = true;
    } else if (holdingSpacebar && !KEY_SPACE_DOWN) {
      var gunX = tank.gun.x;
      var gunY = tank.gun.y;
      var pt = tank.localToGlobal(gunX, gunY);
      currentBullet.fire(pt.x, pt.y, tank.gun.rotation);
      currentBullet = null;
      holdingSpacebar = false;
      tank.resetPower(); // reset power (also have increase power)
    }

    healthMessage.text = "Your Health: "+tank.hp;

    var newBullets = [];
    var bulletInfo = [];
    bullets.forEach(function (b) {
      b.tick(canvas.width, canvas.height);
      /*if (tank.hitTest(b.x, b.y)) {
        tank.takeHit(b.power); 
      }*/
      if (b.isActive()) {
        newBullets.push(b); 
        bulletInfo.push({'x': b.x, 'y': b.y, 'id': b.id});
      } else {
        stage.removeChild(b); 
      }
    });
    bullets = newBullets;


    socket.emit('update', tank.x, tank.gun.rotation, bulletInfo);
    stage.update();
  }

  stage.tick = tick;
  Ticker.setFPS(60);
  Ticker.addListener(stage);
  document.onkeydown = handleKeyAction(true);
  document.onkeyup = handleKeyAction(false);
})();
