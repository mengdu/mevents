/**
* 事件发布订阅对象
* @time 2016-09-04
* @author lanyue
**/
//e._events               e._maxListeners         e.addListener
//e.emit                  e.getMaxListeners       e.listenerCount         e.listeners
//e.on                    e.once                  e.removeAllListeners    e.removeListener
//e.setMaxListeners
var defaultMaxListeners = 10;
function Mevents(){
  //用来存储事件
  this._events={};
  this._maxListeners=defaultMaxListeners;
  this._eventsCount=0;
}
Mevents.prototype.getMaxListeners=function(){
  return this._maxListeners;
}
Mevents.prototype.setMaxListeners=function(num){
  if( typeof num !=='number' ){
    throw new TypeError('"num" argument must be a number');
  }
  this._maxListeners=num;
}
Mevents.prototype.listenerCount=function(type){
  if( !this._events[type] ){
    return 0;
  }
  return this._events[type].length;
}
Mevents.prototype.listeners=function(type){
  return this._events[type] ? this._events[type] : [];
}
Mevents.prototype.on=function(type,listener){
  return __addListener(this,type,listener);
}
Mevents.prototype.addListener = Mevents.prototype.on;

function __addListener(that,type,listener,isOnce){
  if( typeof type !== "string"){
    throw new TypeError('"type" argument must be a string');
  }
  if( typeof listener !=="function"){
    throw new TypeError('"listener" argument must be a function');
  }
  //初次监听此事件
  if(!that._events[type]){
    that._events[type]=[];
    ++that._eventsCount;
  }
  if(isOnce){
    that._events[type]['once']=true;
  }
  //事件溢出检查
  if( that._events[type].length >= that._maxListeners){
    console.warn(that._events[type].length+' "'+type+'" listeners added. Use emitter.setMaxListeners() to increase limit.');
    return that;
  }else{
    that._events[type].push(listener);
  }
  return that;
}
Mevents.prototype.once=function(type,listener){
  return __addListener(this,type,listener,true);
}
function __emit(that,args){
  var i,j,elen,alen,newargs,type,existing;
  type = args[0];
  existing = that._events[type];
  len = existing.length;
  alen = args.length;
  //事件listener不存在
  if( len <=0 ){
    return false;
  }
  //仅有一个事件参数
  if( alen === 1){
    for( i = 0; i < len; i++ ){
      var listener=existing[i];
      listener.apply(null);
    }
  //含有数据参数
  }else{
    newargs=[];
    for( j = 1; j < alen; j++ ){
      newargs.push(args[j]);
    }
    for( i = 0; i < len; i++ ){
      var listener=existing[i];
      listener.apply(this,newargs);
    }
  }
  //如果是once类事件，触发后移除
  if(existing.once){
    that.removeListener(args[0]);
  }
  return true;
}
Mevents.prototype.emit=function(){
  var args = arguments;
  //没有参数
  if( args.length <= 0 ){
    throw new TypeError('argument must be have a event.');
  }
  if( typeof args[0] !== 'string'){
    throw new TypeError(' "type" argument must be a event string.');
  }
  //不存在此事件
  if( !this._events[args[0]] ){
    return false;
  }
  return __emit(this,args);
}

Mevents.prototype.removeListener=function(type){
  if(!type){
    return false;
  }
  if( typeof type !== "string" ){
    throw new TypeError('"type" argument must be a string .');
  }
  if(delete this._events[type]){
    --this._eventsCount;
    return true;
  }else{
    return false;
  }
}
Mevents.prototype.un = Mevents.prototype.removeListener;

Mevents.prototype.removeAllListeners=function(){
  this._events={};
  this._eventsCount=0;
  return true;
}
Mevents.prototype.unAll=Mevents.prototype.removeAllListeners;
