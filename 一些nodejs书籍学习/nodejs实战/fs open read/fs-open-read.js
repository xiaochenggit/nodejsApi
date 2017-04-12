const fs = require('fs');

fs.open('info.txt', 'r', (error, handle) => {
	if (error) {
		console.log(`Error : ${error.code}${error.message}`);
		return;
	} else {
		let buffer = new Buffer(100000);
		fs.read(handle, buffer, 0, 10000, null, (error, length) => {
			if (error) {
				console.log(`Error : ${error.code}${error.message}`);
				return;
			} else {
				console.log(buffer.toString('utf8',0,length));
				fs.close(handle);
			}
		})
	}
});