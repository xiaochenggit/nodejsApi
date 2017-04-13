// 异步,同步读取文件的区别
const fs = require('fs');
fs.readFile('info.txt', 'utf8', (error, data) => {
	console.log('异步读取数据中'+ data);
})
console.log('异步开始读取数据中');
// 输出 同步开始读取数据中 ----- 同步读取数据中

fs.readFileSync('info.txt', 'utf8', (error, data) => {
	console.log('同步读取数据中 : ' + data);
})
console.log('同步开始读取数据中');