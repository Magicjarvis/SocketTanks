(function(window) {
  function Tank(x, y) {
    this.initialize(x, y);
  }

  var p = Tank.prototype = new Container();

  p.Container_initialize = p.initialize;

  p.body;
  p.gun;
  p.red;

  var BODY_WIDTH = 60;
  var BODY_HEIGHT = 30;

  // static properties 
  p.SPEED = 5;
  
  // public properties
  p.hp = 500;

  p.left = function () {
    this.x -= this.SPEED; 
  }

  p.right = function () {
    this.x += this.SPEED; 
  }

  p.gunLeft = function () {
    var rot = this.gun.rotation - this.SPEED;
    this.gun.rotation -= (rot >= 90 && rot <= 270 ? this.SPEED : 0);
  }

  p.gunRight = function () {
    var rot = this.gun.rotation + this.SPEED;
    this.gun.rotation += (rot >= 90 && rot <= 270 ? this.SPEED : 0);
  }

  p.takeHit = function (dmg) {
    p.hp -= dmg; 
    if (p.hp < 0) {
      p.hp = 0; 
    }
  }

  p.gunCharge = function () {
    this.red.alpha += 0.02
  }

  p.resetPower = function () {
    this.red.alpha = 0;
  }

  p.initialize = function (x, y) {
    this.Container_initialize();

    this.body = new Shape();
    this.gun = new Container();
    this.red = new Shape();
    var gun = new Shape();

    this.gun.addChild(gun);
    this.gun.addChild(this.red);
    this.addChild(this.body);
    this.addChild(this.gun);
    
    this.body.graphics.beginFill('rgba('+ Math.floor(Math.random() * 255) +', 125, 125, 50)')
      .drawRoundRect(0, 0, BODY_WIDTH, BODY_HEIGHT, 5);

    gun.graphics.beginFill('rgba(0, 0, 0, 1)')
      .drawRoundRect(0, 0, 10, 25, 5);
    this.red.graphics.beginFill('rgba(255, 0, 0, 1)')
      .drawRoundRect(0, 0, 10, 25, 5);
    this.red.alpha = 0;
    this.body.x = x;
    this.body.y = y - BODY_HEIGHT;
    this.gun.x = x + BODY_WIDTH/2;
    this.gun.y = y + 5 - BODY_HEIGHT;
    this.gun.regX = 5;
    this.gun.rotation = 201;
  }

  // p.public_properties
  // maybe we'll need another constructor
  window.Tank = Tank;
})(window);
