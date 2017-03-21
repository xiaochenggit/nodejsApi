var express = require("express");
var app = new express();
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
app.use('/user',userRouter);
app.use('*',indexRouter);
app.listen(3000);