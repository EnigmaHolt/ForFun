const express = require('express');

const passport = require('passport')

const session = require('express-session');

const routes = require('./routers/index');

const morgan = require('morgan'); // 命令行log显示

const Strategy = require('passport-http-bearer').Strategy;// token验证模块

const config = require('./config');

// 加载模板处理模块
var swig = require('swig');
// 加载数据库模块
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// 处理前端提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');
// 创建app应用 => NodeJs
var app = express().listen()._events.request;
var opn = require('opn');

// 设置静态文件托管
// 当用户访问的URL以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use('/public',express.static(__dirname + '/public') );

// 创建应用模板
// 第一个参数：模板引擎的名称，同事也是模板文件的后缀，第二个参数表示用于u解析处理模板内容的方法
app.engine('html',swig.renderFile);

// 设置模板文件存放的目录，第一个必须是views，第二个参数是目录
app.set('views','./views');


// 在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});


//  bodyparse设置
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//passport模块
app.use(passport.initialize());
app.use(morgan('dev'));

//Cookies
app.set('trust proxy', 1);
app.use(session({
    resave:true,
    saveUninitialized:false,
    secret:'HaoToGo',
    cookie:{secure:true},
    maxAge:100000000,

}));

routes(app);

//监听http请求
var port = 3000;
var uri = 'http://localhost:' + port;
mongoose.Promise = global.Promise;
// 第一个参数 连接的协议和地址
mongoose.connect('mongodb://localhost:27017/togo',{useMongoClient:true},function (err) {
    if(err){
        console.log('数据库连接失败:'+ err.message);
    }else{
        console.log('数据库连接成功'); 
        app.listen(port);
        console.log('> Listening at ' + uri + '\n');
        opn(uri) 
    }
});