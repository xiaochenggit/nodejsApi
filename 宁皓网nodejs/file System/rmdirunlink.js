const fs = require('fs');
// 删除文件
fs.unlink('./public/rename.js', (error) => {
	if (error) {
		console.log(error);
	} else {
		console.log('删除文件成功');
	}
});
// 删除目录
fs.rmdir('./public', (error) => {
	if (error) {
		console.log(error);
	} else {
		console.log('删除目录成功');
	}
})