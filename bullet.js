(function(window) {
  function Bullet() {
    this.initialize();
  }

  var p = Bullet.prototype = new Shape();

  p.Shape_initialize = p.initialize;

  // static properties 
  p.MAX_POWER = 25;
  p.INITIAL_POWER = 10;
  p.GRAVITY = 0.5;

  // Private properties
  p.power;
  p.vx;
  p.vy;
  p.active;
  p.shot;

  p.initialize = function () {
    this.Shape_initialize(); // what does this do?
    this.power = this.INITIAL_POWER;
    this.active = true;
    this.shot = false;
  }

  p.fire = function (x, y, rot) {
    this.graphics.beginFill('rgba(0, 0, 0, 1)')
      .drawCircle(0,0, 3);
    this.x = x;
    this.y = y;
    this.rotation = rot;
    this.vx = Math.sin(this.rotation * Math.PI/-180) * this.power;
    this.vy = Math.cos(this.rotation * Math.PI/-180) * this.power;
    this.shot = true;
  }

  p.increasePower = function () {
    if (this.power >= this.MAX_POWER) {
      this.power = this.MAX_POWER;
    } else {
      this.power *= 1.02;
    }
  }

  p.isActive = function () {
    return this.active;
  }

  p.tick = function (w, h) {
    if (!this.shot) {
      return
    }
    this.vy += p.GRAVITY;
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.y >= h || this.x >= w || this.x <= 0) {
      this.active = false;
    }
  }

  // p.public_properties
  // maybe we'll need another constructor
  window.Bullet = Bullet;
})(window);
