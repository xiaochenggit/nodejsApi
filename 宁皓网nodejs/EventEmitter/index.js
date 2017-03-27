const EventEmitter = require('events');
// Player 继承
class Player extends EventEmitter {};
// 创建实例
var player = new Player();
// once 是单词绑定事件只能触发一次、而 on 可以触发多次
player.on('play', (trank) => {
	console.log(`正在播放：《${trank}》`);
})
// 触发事件
player.emit('play','再见理想');
player.emit('play','海阔天空');