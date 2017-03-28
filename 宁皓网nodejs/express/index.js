const  express =  require('express');
// 地址
const path = require('path');
// 记录请求日志用的中间件
const  morgan = require('morgan');
// 表单提交的中间件,放到 request.body 对象中
const bodyParser = require('body-parser');

const app = express();

let comments = [];
app.locals.comments = comments;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : false }));

// 设置模板地址
app.set('views',path.resolve(__dirname, 'views'));
// 设置模板引擎
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	// res.send('<h1>nodejs niubi</h1>');
	res.render('index');
})

app.get('/comments', (request, response) =>{
	response.render('comments/index');
})

app.get('/comments/new', (request, response) => {
	response.render('comments/new');
})

app.post('/comments/new', (request, response) => {
	if (!request.body.comment) {
		response.status(400).send('你没有什么要说的吗?');
		return;
	}
	comments.push({
		comment: request.body.comment,
		created_at: new Date()
	})
	// 重定向
	response.redirect('/comments');
})

app.listen(3000, () => {
	console.log('listen to 3000')
});