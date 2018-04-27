function Barrier(parent, options){
  this.options = options || {};
  this.options.parentString = parent;
  this.init();
}

// 继承util对象方法
var proto = Barrier.prototype = Object.create(Util);

proto.init = function(){
  var self = this;
  this.initBarrier();
  this.style = this.getStyle(this.barrier);
  this.targetInfo = this.getDomInfo(this.style);
  this.parentInfo = this.getDomInfo(this.getStyle(this.parent));
  setTimeout(function(){
    self.start();
  }, this.options.delay)
}

proto.initBarrier = function(){
  this.parent = this.getDom(this.options.parentString);
  this.barrier = this.createBarrier();
  this.parent.appendChild(this.barrier);
}

proto.createBarrier = function(){
  var barrier = document.createElement('div');
  barrier.className = this.options.className;
  barrier.style.top = this.options.initY + 'px';
  barrier.style.left = this.options.initX + 'px';
  return barrier;
}

proto.getMovePoint = function(){
  return {
    x: this.movePoint.x + this.targetInfo.x,
    y: this.movePoint.y + this.targetInfo.y,
  }
}
proto.changePoint = function(movePoint){
  // 这里处理坐标
  // 飞船的宽高和坐标
  var targetPoint = this.options.targetCoord.endPoint;
  var targetMovePoint = this.options.targetCoord.movePoint;
  var targetSize = this.options.targetCoord.targetDomInfo;
  // 飞船的中心坐标
  var c_target = {
    x: targetPoint.x + targetMovePoint.x + (targetSize.width/2),
    y: targetPoint.y + targetMovePoint.y + (targetSize.height/2),
  }

  // 障碍物的宽高和坐标
  console.log('----zwb-----');
  this.style = this.getStyle(this.barrier);
  var targetInfo = this.getDomInfo(this.style);

  // 障碍物的中心坐标
  var c_souce = {
    x: targetInfo.x + (targetInfo.width/2),
    y: targetInfo.y + (targetInfo.height/2),
  }

  // 计算两个物体的角度坐标
  var deg = Math.atan2(c_target.y - c_souce.y, c_target.x - c_souce.x);
  log(deg)


  // 这次移动的距离
  var speed = this.options.initSpeed;


  var x_speed = Math.cos(deg) * speed;
  var y_speed = Math.sin(deg) * speed;

  var x = x_speed;
  var y = y_speed;
  this.movePoint.x = this.movePoint.x + x;
  this.movePoint.y = this.movePoint.y + y;
  console.log('源原点：', c_souce);
  console.log('目标原点：', c_target);
  this.options.move && this.options.move.call(this, this.getMovePoint());
}
proto.stopMove = function(){
  this.enable = false;
}

proto.start = function(){
  this.enable = true;
  this.movePoint = {
    x: 0,
    y: 0
  }

  // 重写定时器
  var self = this;
  this.callback = this.changePoint.bind(this);
  this.__render = function() {
      if (!self.enable) {
          // 通过直接return取消定时器
          return;
      }
      self.callback && self.callback(self.movePoint);
      self.setTransform(false, self.barrier, self.movePoint);
      window.setTimeout(function(){ 
        self.__render();
      }, 100)
  }
  this.__render();
},

proto.end = function(){

}