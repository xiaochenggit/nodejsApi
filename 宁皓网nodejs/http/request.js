var http= require('http'); 
var options = { 
	protocal: 'http:',
	hostname: 'www.duoqu.com', 
	port: 80, 
	path: '/game/server/index/op/1/g/50?v=js&callback=fad&_rnd=62986243894', 
	method: 'GET' 
}; 
//http://www.duoqu.com/game/server/index/op/1/g/50?v=js&callback=dj.login.getGameServersCallback&_rnd=62986243894
var responseDate = '';
var req = http.request(options, function(res) { 
	console.log('STATUS: ' + res.statusCode); 
	console.log('HEADERS: ' + JSON.stringify(res.headers)); 
	res.setEncoding('utf8'); 
	res.on('data', function (chunk) { 
		responseDate += chunk; 
	}); 
	res.on('end', ()=>{
		if (/(\{.*\})/.test(responseDate)) {
			var servers = JSON.parse(RegExp.$1).data.server;
			servers.map( (item) =>{
				console.log(item[1]);
			})
		}
	})
}); 
 
req.on('error', function(e) { 
	console.log('problem with request: ' + e.message); 
}); 
// write data to request body 
req.write('data\n'); 
req.write('data\n'); 
req.end();