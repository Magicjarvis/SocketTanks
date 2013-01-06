SocketTanks
===========

##Objects

Tank
----
####Constructor
Tank(x, y)
####Properties
- _body_ : Shape  
- _gun_ : Shape  
- _hp_ : number  

####Methods
- _left()_   
- _right()_  
- _gunLeft()_  
- _gunRight()_  
- _gunCharge()_  
- _takeHit(dmg)_  
- _resetPower()_ 

Bullet
------
####Constructor
Bullet()
####Properties
- _power_ : number  
- _vx_ : number  
- _vy_ : number  
- _active_ : boolean  
- _shot_ : boolean

####Methods
- _fire(x, y, rot)_  
- _increasePower()_  
- _isActive()_ : boolean  
- _tick()_  