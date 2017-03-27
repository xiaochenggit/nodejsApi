const fs = require('fs');
fs.rename('public/index.js', 'public/rename.js', (error) => {
	if (error) {
		console.log(error);
	} else {
		console.log('重命名文件成功');
	}
})