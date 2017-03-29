const http = require('https');
// 解析 html 的模块
const cheerio = require('cheerio');
var Promise = require('bluebird');
const fs = require('fs');
var  urlArray = ['19902300','40865813'];
const url = 'https://www.zhihu.com/question/';
var hot = {
	'url' : 'https://www.zhihu.com/question/hot',
	'fiter': function (html) {
		var $ = cheerio.load(html);
		var list = $('.question_link');
		console.log(list.text());
	}
};
http.get(hot.url,(res) => {
	res.on('data', (chunk) => {
		hot['data'] += chunk;
	});
	res.on('end', () => {
		console.log('hot 页面已经爬取完了');
		hot.fiter(hot.data);
	});
}).on('error',(error) => {
	if (error) {
		console.log(error);
	}
})

// 爬取
function getPageAsync(url){
    return new Promise(function(resolve,reject){
        console.log('正在爬取' + url);
 
        http.get(url,function(res){
            var html = ''
 
            res.on('data',function(data){
                html += data
            })
 
            res.on('end',function(){
            	filterResponseDate(html);
                resolve(html);
            })
        }).on('error',function(e){
            reject(e)
            console.log('获取课程数据出错')
        })
    })
}
// 添加序列
function goBug() {
	var fetchCourseArray = []; 
	urlArray.forEach(function(id){
	    fetchCourseArray.push(getPageAsync(url + id))
	})
	// 载入
	Promise
	.all(fetchCourseArray)
	.then(function(pages){
		console.log(pages.length);
	    var coursesData = []
	    pages.forEach(function(html){
	        var courses = filterResponseDate(html)
	        coursesData.push(courses)
	    })
			saveDate(JSON.stringify(coursesData));
	})
}
// 过滤数据
function filterResponseDate (html) {
	let $ = cheerio.load(html);
	var obj = {};
	// 问题名字
	obj['questionName'] = $('h1.QuestionHeader-title').text();
	console.log(obj['questionName']);
	// 问题描述
	obj['detail'] = $('.QuestionHeader-detail .RichText').text();
	// 关注人数
	obj['followers'] = parseInt($('.QuestionHeader .NumberBoard-value').eq(0).text());
	// 浏览
	obj['browse'] = parseInt($('.QuestionHeader .NumberBoard-value').eq(1).text());
	// 评论数
	obj['commentNumber'] = parseInt($('.QuestionHeader-actions').text());
	// 回答数
	obj['answerNumber'] = parseInt($('.Question-mainColumn .List-headerText').text());
	// 回答 arr
	obj['answer'] = [];
	var answer = $('.Question-mainColumn .List-item');
	answer.each( function (index, ele) {
		var answerObj = {};
		// 用户名
		answerObj['name'] = $(this).find('.UserLink-link').text();
		// 擅长领域
		answerObj['begood'] = $(this).find('.AuthorInfo-badge').text();
		// Begood.each( function (index, ele) {
		// 	answerObj['begood'].push($(this).text());
		// })
		// 赞同
		answerObj['agreeNumber'] = parseInt($(this).find('.AnswerItem-extraInfo .Voters').text());
		// 内容
		answerObj['content'] = $(this).find('.RichContent-inner').text();
		// 时间
		answerObj['time'] = $(this).find('.ContentItem-time span').text().split(' ')[1];
		obj['answer'].push(answerObj);
	})
	var type = $('.Tag.QuestionTopic');
	obj['type'] = [];
	type.each(function (index, ele) {
		obj['type'].push($(this).text());
	})
	return obj;
}
// 保存数据
function saveDate (date) {
	fs.writeFile('zhihu.json', date, (error) => {
		if (error) {
			console.log(error);
		} else {
			console.log('保存数据成功');
		}
	})
}