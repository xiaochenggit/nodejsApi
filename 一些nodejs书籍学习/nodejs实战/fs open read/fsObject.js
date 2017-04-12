const fs = require('fs');
function fileObj () {
	this.filename = '';
	this.file_info = function (callback) {
		console.log(`正在打开：${this.filename}`);
		fs.open(this.filename, 'r', (error, handle) => {
			if (error) {
				console.log('Can not find' + this.filename);
				return callback(error);
			} else {
				callback(null, handle);
			}
		})
	}
}

var file = new fileObj();
file.filename = 'info.txt';
file.file_info( (error, handle) => {
	if (error) {
		console.log(`Error : ${error.code} ${error.message}`);
	} else {
		console.log('打开文件成功');
		var buffer = new Buffer(10000);
		fs.read(handle, buffer, 0, 10000, null, (error,length) => {
			console.log(buffer.toString('utf8', 0, length));
			fs.close(handle);
		})
	}
})