var fs = require('fs');
var data = JSON.parse(fs.readFileSync('data.json','utf8'));
module.exports = data;