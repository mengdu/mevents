/**
* @file 延迟的事件驱动
*
***/
;(function(){

/*
* 延迟事件函数
* @constructor
* @param {string} type - 延迟事件驱动标记
* @return {Object} 返回对象
*/
function deferEvent(type){
	return new deferEvent.init(type);
}
//采用全局对象存储事件驱动对象
deferEvent.__events = {};

deferEvent.init = function( event ){
	this.event = event;
	//如果不存在指定event则创建
	if( !deferEvent.isExitEvent( event ) ){
		//创建一个事件驱动对象Mevents
		deferEvent.__events[ event ] = new Mevents();
		//存储事件状态
		deferEvent.__events[ event ].__eventsInfo = {};
	}
}

/*
* 检测是否存在事件驱动标记
* @param {string} event - 事件驱动标记
* @returns {bool} 返回bool
*/
deferEvent.isExitEvent = function( event ){
	return deferEvent.__events[ event ] ? true : false;
}

var defer = deferEvent;

var fn = deferEvent.init.prototype;

/*
* 监听事件
* @param {string} type - 事件名称
* @param {function} listener - 事件回调函数
* @returns {null} 没有返回值
*/
fn.on = function( type , listener ){
	if( typeof type !== "string" ){
		throw new TypeError( '"type" argument must be a string' );
	}
	if( typeof listener !== "function" ){
		throw new TypeError( '"listener" argument must be a function' );
	}
	var event = this.getEventObj();
	//once监听事件
	event.once( type , listener );

	//如果事件已经emit，则立刻执行listener
	if(this.isEmit( type )){
		event.emit( type , event.__eventsInfo[ type ].data );
	}else{
		event.__eventsInfo[ type ] ? "" : event.__eventsInfo[ type ] = {
			status : false,
			data : undefined,
		};
	}
}
/*
* 触发事件方法
* @param {string} type - 事件名称
* @param {var} data - 传输数据
* @returns {null} 没有返回值
*/
fn.emit = function( type , data ){
	var event = defer.__events[ this.event ];

	//如果已经存在此事件，并且事件列表中存在,则执行触发事件
	if( event.__eventsInfo[ type ] && event.listeners( type ).length > 0 ){
		event.emit( type , data );
		this.removeListener( type );
	}else{
		event.__eventsInfo[ type ] = {
			status : true,
			data : data,
		};
	}
}
/*
* 移除事件信息
* @param {string} type - 事件名称
* @returns {bool} 返回bool值
*/
fn.removeListener = function( type ){
	if( !type ){
		return false;
	}
	if( typeof type !== "string" ){
		throw new TypeError( '"type" argument must be a string .' );
	}
	if(delete defer.__events[ this.event ].__eventsInfo[ type ]){
		return true;
	}else{
		return false;
	}
}
/*
* 返回当前Mevent对象
* @returns {Mevent} 返回Mevent对象
*/
fn.getEventObj = function(){
	return defer.__events[ this.event ];
}
/*
* 检测是否已经执行触发操作
* @param {string} type - 事件名称
* @returns {bool} 返回bool值
*/
fn.isEmit = function( type ){
	var event = defer.__events[ this.event ];
	//返回事件的状态信息
	return event.__eventsInfo[ type ] ? event.__eventsInfo[ type ].status : false;
}




if ( typeof define === "function" && define.amd ) {
	define(function() { return deferEvent; });

} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = deferEvent;
} else {
	window.deferEvent = deferEvent;
}


})();
