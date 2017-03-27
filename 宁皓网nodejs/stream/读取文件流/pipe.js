const fs = require('fs');
// 引入压缩模块
const zlib = require('zlib');

var fileReadStream = fs.createReadStream('dj.js');
var fileWriteStream = fs.createWriteStream('dj.js.gz');
// 源流
fileWriteStream.on('pipe', (source) => {
	console.log(source);
})
// pipe 注入
fileReadStream
	.pipe(zlib.createGzip())
	.pipe(fileWriteStream);