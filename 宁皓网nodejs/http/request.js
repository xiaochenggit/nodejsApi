const http = require('http');

// var options = {
// 	protocol: 'http:',
// 	hostname: 'api.douban.com',
// 	port: '80',
// 	path: '/v2/movie/top250'
// };
var options = { 
hostname: 'www.google.com', 
port: 80, 
path: '/upload', 
method: 'POST' 
}; 
var responseDate = '';
var request = http.request(options, (response) => {
	console.log(response);
	response.setEncoding('utf8');
	response.on('data', (chunk) => {
		responseDate += chunk;
	})
	response.on('end', () => {
		console.log(JSON.parse(responseDate));
	})
});

request.on('error', (error) => {
	console.log(error);
})

request.on('end', () => {
	console.log('结束');
})