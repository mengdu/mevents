;(function(){

var defaultMaxListeners = 10;
/*
* 事件驱动对象
* @constructor 
*/
function Mevents(){
	//用来存储事件
	this._events = {};
	this._maxListeners = defaultMaxListeners;
	this._eventsCount = 0;
}

/*
* 获取单个事件允许最大监听数
* @returns {bool} 返回bool
*/
Mevents.prototype.getMaxListeners = function () {
	return this._maxListeners;
}

/*
* 设置单个事件允许最大监听数
* @param {number} num - 数字
*/
Mevents.prototype.setMaxListeners = function (num) {
	if (typeof num !== 'number') {
		throw new TypeError('"num" argument must be a number');
	}
	this._maxListeners = num;
}

/*
* 获取事件的监听数
* @param {string} type - 事件名
* @return {number} 返回数字
*/
Mevents.prototype.listenerCount = function (type) {
	if (!this._events[type]) {
		return 0;
	}
	return this._events[type].length;
}

/*
* 获取指定事件的函数列表
* @param {string} type - 数字
* @returns {array} 返回函数列表数组
*/
Mevents.prototype.listeners = function (type) {
	return this._events[type] ? this._events[type] : [];
}

/*
* 监听事件
* @param {string} type - 事件名称
* @param {function} listener - 事件的函数
* @return {Mevent} 返回当前对象
*/
Mevents.prototype.on = function (type , listener) {
	return __addListener(this , type , listener);
}
Mevents.prototype.addListener = Mevents.prototype.on;

/*
* 监听事件
* @param {Mevent} that - Mevent对象
* @param {string} type - 事件名称
* @param {function} listener - 事件的函数
* @param {bool} isOnce - 是否是一次事件
* @return {Mevent} 返回当前对象
*/
function __addListener (that , type , listener , isOnce) {
	if (typeof type !== "string") {
		throw new TypeError('"type" argument must be a string');
	}
	if (typeof listener !== "function") {
		throw new TypeError('"listener" argument must be a function');
	}
	//初次监听此事件
	if (!that._events[type]) {
		that._events[type] = [];
		++that._eventsCount;
	}
	if (isOnce) {
		that._events[type]['once'] = true;
	}
	//事件溢出检查
	if (that._events[type].length >= that._maxListeners) {
		console.warn(that._events[type].length + ' "' + type + '" listeners added. Use emitter.setMaxListeners() to increase limit.');
		return that;
	} else {
		that._events[type].push(listener);
	}
	return that;
}

/*
* 一次事件
* @param {string} type - 事件名称
* @param {function} listener - 事件的函数
* @return {Mevent} 返回当前对象
*/
Mevents.prototype.once = function (type , listener) {
	return __addListener(this , type , listener , true);
}

/*
* @param {Mevent} that - 返回当前对象
* @param {var} args - 传输数据
* @returns {bool} 返回bool
*/
function __emit (that , args) {
	var i,j,elen,alen,newargs,type,existing;
	type = args[0];
	existing = that._events[type];
	len = existing.length;
	alen = args.length;
	//事件listener不存在
	if (len <=0) {
		return false;
	}
	//仅有一个事件参数
	if (alen === 1) {
		for (i = 0; i < len ; i++) {
		  var listener = existing[i];
		  listener.apply(null);
		}
	//含有数据参数
	} else {
		newargs = [];
		for(j = 1 ; j < alen ; j++) {
			newargs.push(args[j]);
		}
		for (i = 0 ; i < len ; i++) {
			var listener = existing[i];
			listener.apply(this , newargs);
		}
	}
	//如果是once类事件，触发后移除
	if (existing.once) {
		that.removeListener(args[0]);
	}
	return true;
}

/*
* 触发事件
* @param {string} arguments[0] - 事件名
* @param {var} arguments[1] - 数据
* @returns {bool} 返回bool
*/
Mevents.prototype.emit = function () {
	var args = arguments;
	//没有参数
	if (args.length <= 0) {
		throw new TypeError('argument must be have a event.');
	}
	if (typeof args[0] !== 'string') {
		throw new TypeError(' "type" argument must be a event string.');
	}
	//不存在此事件
	if (!this._events[args[0]]) {
		return false;
	}
	return __emit(this , args);
}

/*
* 移除指定监听事件
* @param {string} type - 事件名称
* @returns {bool} 返回bool值
*/
Mevents.prototype.removeListener = function (type) {
	if (!type) {
		return false;
	}
	if (typeof type !== "string") {
		throw new TypeError('"type" argument must be a string .');
	}
	if (delete this._events[type]) {
		--this._eventsCount;
		return true;
	} else {
		return false;
	}
}
Mevents.prototype.un = Mevents.prototype.removeListener;

/*
* 移除所有监听事件
* @returns {bool} 返回bool值
*/
Mevents.prototype.removeAllListeners = function () {
	this._events = {};
	this._eventsCount = 0;
	return true;
}
Mevents.prototype.unAll = Mevents.prototype.removeAllListeners;

Mevents.inherits = function (ctor, superCtor) {

  if (ctor === undefined || ctor === null)
  	throw new TypeError('The constructor to "inherits" must not be null or undefined');
  if (superCtor === undefined || superCtor === null)
  	throw new TypeError('The super constructor to "inherits" must not be null or undefined');
  if (superCtor.prototype === undefined)
  	throw new TypeError('The super constructor to "inherits" must have a prototype');

  ctor.prototype.__proto__ = superCtor.prototype;
}


if (typeof define === "function" && define.amd) {
	define(function () {return Mevents;});

} else if (typeof module !== "undefined" && module.exports) {
	module.exports = Mevents;
} else {
	window.Mevents = Mevents;
}

})();
