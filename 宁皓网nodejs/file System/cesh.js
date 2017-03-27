const fs = require('fs');
fs.readdirSync('ceshi').map( (file) => {
	fs.unlink('ceshi/' + file, (error) => {
		if (error) {
			console.log(error);
		} else {
			console.log('成功删除文件' + file);	
		}
	});		
})
fs.rmdir('ceshi', (error) => {
	if (error) {
		console.log(error);	
	} else {
		console.log('成功删除目录' + 'ceshi');
	}
})