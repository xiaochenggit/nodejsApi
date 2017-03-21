var fs = require('fs');
fs.readFile('index.txt',function (err, data) {
	if (err) {
		throw  err;
	}else{
		var str = data.toString();
		var result = {};
		var lines = str.split('\n');
		lines.forEach( function (line) {
			var arr = line.split(' ');
			if (!result[arr[1]]) {
				result[arr[1]] = 0;
			}
			result[arr[1]] += parseInt(arr[2]); 
		});
		fs.writeFile('index-2.txt', result['B'], function (err) {
			if (err) {
				throw  err;
			};
		});
	}
})