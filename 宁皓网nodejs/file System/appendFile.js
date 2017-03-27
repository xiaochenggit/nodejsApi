const fs = require('fs');
// 追加内容
fs.appendFile('public/index.js', '我是追加的内容', (error) => {
	if (error) {
		console.log(error);
	} else {
		console.log('追加内容成功');	
	}
})