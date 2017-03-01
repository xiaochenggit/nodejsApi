var Buffer = require("buffer").Buffer;
var buf = Buffer.from("Hello World");

console.log('hex : '+ buf.toString('hex'));
console.log("base64 : " + buf.toString('base64'));