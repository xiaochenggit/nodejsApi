var fs = require("fs");
function copy(){
	fs.writeFileSync("new.txt",fs.readFileSync("old.txt"));
	// 如果是大文件
	// 创建一个可读流，然后再创建可写流
	fs.createReadStream("old.psd").pipe(fs.createWriteStream("new.psd"));
}
copy(); 