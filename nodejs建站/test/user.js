// 随机生成字符串
var crypto = require('crypto');
// 加密
var bcrypt = require('bcrypt');
// 随机字符
function getRandomString (len) {
	var len = len || 16;
	return crypto.randomBytes(Math.ceil(len / 2).toString('hex'));
}

var should = require('should');

var app = require('../../app.js');
var mongoose = require('mongoose');
var User = require('../../app/models/user');
