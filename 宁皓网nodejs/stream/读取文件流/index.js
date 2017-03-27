const fs = require('fs');
// 创建一个可读流
var fileReadStream = fs.createReadStream('dj.js');
// 创建一个可写流
var fileWriteStream = fs.createWriteStream('dj1.js');
var count = 0;
// 触发事件
fileReadStream.once('data', (chunk) => {
	console.log(chunk);
})
fileReadStream.on('data', (chunk) => {
	// 写入到文件里
	fileWriteStream.write(chunk);
	console.log(`${++count}  接收到 ：${chunk.length}`);
})
// 结束事件
fileReadStream.on('end', () => {
	console.log('结束');
})
// 错误
fileReadStream.on('error', (error) => {
	console.log(error);
})