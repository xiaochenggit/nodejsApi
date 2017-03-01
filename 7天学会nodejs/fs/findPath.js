var fs = require("fs");
var path = require("path");
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file,index) {
    	console.log(index);
        var pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}
travel("/github/nodejsApi/7天学会nodejs/fs", function (pathname) {
    console.log(pathname);
});