
## Mevents

 `Mevents` 是一个自定义事件的对象，接口与功能和nodejs中的 `events` 模块的 `EventEmitter` 对象相同。
 算是个仿写 `EventEmitter` 吧，但是内部代码不太一样，主要接口功能一样。
 可以实现事件的订阅/与发布，可以用在一些异步编程逻辑中。
 可以在浏览器端使用也可以在nodejs端使用。

 **[阅读具体api](https://github.com/mengdu/mevents/blob/master/api.md)**

 简单使用例子：

 ```js

 var eventDemo=new Mevents;
 //监听一个自定义事件 myEvent
 eventDemo.on('myEvent',function(){
   console.log(arguments);
 });

//触发myEvent事件
eventDemo.emit('myEvent',"触发事件啦。");

 ```
 注：仅需要 `mevents.js` 文件即可。

 更详细例子请看 `demo.html` 。

## derferEvent

`derferEvent` 是一个延迟事件函数，具体用法看列子：

在未知事件订阅与发布执行顺序时也可以实现异步编程通讯

```
var t1 = Math.random()*10*1000;
var t2 = Math.random()*10*1000;

console.log('t1:'+t1,'t2:'+t2);
setTimeout(function(){
	console.log('setTimeout1');
	deferEvent('test').on('start',function(e){
		console.log(e);
	});
},t1);

setTimeout(function(){

	console.log('setTimeout2');
	deferEvent('test').emit('start',"触发start事件");
},t2);

```
`deferEvent(type)` 中的 `type` 用于标记一个延迟的事件驱动。

两个 `setTimeout` 中的回调执行顺序是未知的， 在这种情况下用deferEvent就可以很容易实现异步通讯。




**实用例子**：

比如一个基于api的网页，网页导航是固定的数据，那么定义个`config.js` 用ajax来获取数据；

```
//config.js
$.ajax({
	...
	,success:function(e){
		...
	}

})

```
那么有个 `index.html` ,加载了 `config.js` ,正好，你要加载个 `index.js` 用于对 `index.html` 页面的处理，并且还需要用到`config.js` 取到的配置信息。

在上述需求中怎么实现呢？

那么通过 `deferEvent` 就可以简单处理：

config.js

```
//config.js
$.ajax({
	...
	,success:function(e){
		deferEvent('config').emit('success',e);//传送数据
	}

})

```
index.js

```
deferEvent('config').on('success',function(e){
	...
});

```


