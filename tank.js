(function(window) {
  function Tank(x, y) {
    this.initialize(x, y);
  }

  var p = Tank.prototype = new Container();

  p.Container_initialize = p.initialize;

  p.body;
  p.gun;

  var BODY_WIDTH = 60;
  var BODY_HEIGHT = 30;


  // static properties 
  p.SPEED = 5;
  
  

  // public properties
  p.power = 10;
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

  p.red = 1;
  p.gunCharge = function () {
    if (p.power >= 25) {
      p.power = 25; 
      /*this.gun.graphics.beginFill('rgba(255, 0, 0, 50)')
        .drawRoundRect(0, 0, 10, 25, 5);*/
    } else {
      p.power *= 1.02; 
      /*var log = 'rgba('+ Math.round(255 * ((p.power - 10)/15.0)) +', 0, 0, 50)';
      this.gun.graphics.beginFill(log)
        .drawRoundRect(0, 0, 10, 25, 5);*/
    }
  }

  p.resetPower = function () {
    p.power = 10; 
    this.gun.graphics.beginFill('rgba(1, 0, 0, 50)')
      .drawRoundRect(0, 0, 10, 25, 5);
  }

  p.initialize = function (x, y) {
    this.Container_initialize();

    this.body = new Shape();
    this.gun = new Shape();

    this.addChild(this.body);
    this.addChild(this.gun);
    
    this.body.graphics.beginFill('rgba('+ Math.floor(Math.random() * 255) +', 125, 125, 50)')
      .drawRoundRect(0, 0, BODY_WIDTH, BODY_HEIGHT, 5);

    this.gun.graphics.beginFill('rgba(1, 0, 0, 50)')
      .drawRoundRect(0, 0, 10, 25, 5);
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
