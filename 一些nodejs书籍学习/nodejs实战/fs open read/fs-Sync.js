const fs = require('fs');
let handle = fs.openSync('info.txt', 'r');
let buffer = new Buffer(10000);
let read = fs.readSync(handle, buffer, 0, 10000, null);
console.log(buffer.toString('utf8', 0,read));
fs.closeSync(handle);