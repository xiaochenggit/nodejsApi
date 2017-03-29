const https = require('https');
const cheerio = require('cheerio');
const request = require('request');
const Promise = require('bluebird');
const fs = require('fs');
var index = {
	data : '',
	url : 'https://threejs.org/',
	filter : function (html) {
		var $ = cheerio.load(html);
		var imgArr = $('#projects a img');
		var _this = this;
		imgArr.each(function () {
			_this.imgSrcArr.push($(this).attr('src'));
		});
		fs.writeFile('three/imgSrcArr.json', JSON.stringify(_this.imgSrcArr), (error) => {
			if (error) {
				console.log(error);
			} else {
				console.log('保存文件成功');
				goBug();
			}
		})
	},
	imgSrcArr:[]
};
https.get(index.url, (response) => {
	console.log('statusCode : ' + response.statusCode);
	response.on('data', (chunk) => {
		index.data += chunk;
	})
	response.on('end', () => {
		index.filter(index.data);
	})
}).on('error', (error) =>{
	console.log(error)
});
function getPageAsync(url,name){
    return new Promise(function(resolve,reject){
        console.log('正在爬取' + url);
        request(url).pipe(fs.createWriteStream('three/img/'+name));
    })
}
// 添加序列
function goBug() {
	var fetchCourseArray = []; 
	index.imgSrcArr.forEach(function(id){
		var arr =  id.split('/');
		var name = arr[arr.length-1];
	    fetchCourseArray.push(getPageAsync(index.url + id,name))
	})
	// 载入
	Promise
	.all(fetchCourseArray)
	.then(function(){
		
	})
}