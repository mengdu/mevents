
## Mevents

 `Mevents` 是一个自定义事件的对象，接口与功能和nodejs中的 `events` 模块的 `EventEmitter` 对象相同。
 算是个仿写 `EventEmitter` 吧，但是内部代码不太一样，主要接口功能一样。

 可以在浏览器端使用也可以在nodejs端使用。

 **[阅读具体api]()**

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

## 用途

和nodejs中的 `EventEmitter` 一样，用来发布订阅事件的。
