const express = require('express');
const path  = require('path');
// 用于客户端与服务端的通信
const socketIO = require('socket.io');
const app = express();
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine','ejs');

app.get('/', (request, response) => {
	response.render('index');
})

let server = app.listen(3000, ()=> {
	console.log('listen to 3000');
})

let io = socketIO(server);

// 连接的时候触发
io.on('connection', (socket) => {
	console.log('user is connection');
	socket.on('disconnect', () => {
		console.log('user is disconnect');
	});
	// 接收事件
	socket.on('message', (message) => {
		console.log(message);
		// 触发广播事件
		io.emit('message', message);
	})
})