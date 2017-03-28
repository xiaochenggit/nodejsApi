const http = require('http');
// 解析 html 的模块
const cheerio = require('cheerio');
const fs = require('fs');
const url = 'http://www.duoqu.com/game/list/index';

var responseData = '';

var request = http.get(url, (response) => {
	response.on('data', (chunk) => {
		responseData += chunk;
	});
	response.on('end', () => {
		console.log('获取完毕');
		filterRespones (responseData);
	});
})
var Arraydate = [];
function filterRespones (html) {
	var $ = cheerio.load(html);
	var list = $('.game-bd-item');
	list.each( function(element, index) {
		var obj = {};
		var name = $(this).find('.cYellow .cGreen').text();
		obj['name'] = name;
		var items = $(this).find('.c-fl p');
		var arr = ['type','theme','performance','style','battle','fit']
		items.each( function (index , element) {
			var itemsnr = $(this).find('.cGreen');
			itemsnr.each( function (index , element) {
				obj[arr[index]] = $(this).text();
			})
			Arraydate.push(obj);
		});
	});
	console.log(JSON.stringify(Arraydate));
	fs.writeFile('data.json', JSON.stringify(Arraydate), (error) => {
		if (error) {
			console.log(error);
		} else {
			console.log('保存文件成功');
		}
	})
}

request.on('error', (error) => {
	console.log(error)
})