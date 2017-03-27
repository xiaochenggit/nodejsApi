const fs = require('fs');
// 读取文件 文件目录和名字、返回参数 err 和 读取信息 
fs.stat('index.js', (error, stats) => {
	if (error) {
		console.log(error);
	} else {
		// 读取信息
		console.log(stats);
		// 是否是文件
		console.log(`文件：${stats.isFile()}`);
		// 是否是目录
		console.log(`目录：${stats.isDirectory()}`)
	}
});
// 创建目录
fs.mkdir('public', (error) => {
	if (error) {
		console.log(error);
	} else {
		console.log('创建 public 目录成功');
	}
});
// 写入文件 
fs.writeFile('public/index.js', 'window.onload = function () { alert ("aa") }\n', (error) => {
	if (error) {
		console.log(error);
	} else {
		console.log('写入文件成功');
	}
})
// 追加内容
fs.appendFile('public/index.js', '我是追加的内容', (error) => {
	if (error) {
		console.log(error);
	} else {
		console.log('追加内容成功');
	}
})