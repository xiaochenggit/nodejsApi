const fs = require('fs');
// 读取文件 指定读取的格式
fs.readFile('public/index.js', 'utf8', (error, data) => {
	if (error) {
		console.log(error);
	} else {
		// 转换为字符串 如果没有规定格式 就需要使用 data.toString()
		console.log(data);
	}
})