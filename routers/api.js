const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// 引入model模块，定义一个对象，通过操作对象的方式去操作数据库
const mongoose = require('mongoose');
const config = require('../config');
const passport = require('passport');
const User = require('../Models/user');
require('../passport')(passport);

// 统一返回格式
var responseData;

router.use( function (req,res,next) {
    responseData = {
        code: 0,
        message:''
    };
    next();
});


// 用户注册
    // 注册逻辑 2
   // 数据验证
router.post('/user/register',function (req,res) {
    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var mobile = req.body.mobile;
    var email = req.body.email;
    // 判断用户名是否为空
    if( username == ''){
        responseData.code = 2;
        responseData.message = '用户名为空';
        res.json(responseData);
        return;
    }
    // 判断密码是否为空
    if( password == ''){
        responseData.code = 2;
        responseData.message = '密码为空';
        res.json(responseData);
        return;
    }
    // 判断两次密码是否一致
    if( password != repassword){
        responseData.code = 2;
        responseData.message = '密码不匹配';
        res.json(responseData);
        return;
    }
    // 判断用户名是否已经注册
    User.findOne({
        username:username
    },function (err,doc) {
        if(doc){
            responseData.code = 3;
            responseData.message = '用户名已注册';
            res.json(responseData);
            return;
        }
        // 保存用户注册的信息到数据中
        var user = new User({
            username: username,
            password: password
        });
        user.save(((err)=>{
            if(err){
            responseData.code = -1;
            responseData.message= "错误！"
            res.json(responseData);
            return 
            }

            responseData.code = 4;
            responseData.message = '注册成功';
            res.json(responseData);
            return;
        }));
        
    });


});


// 用户登录
router.post('/user/login',function (req,res) {
    // console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;

    if(password == ''|| username==''){
        responseData.code = 2;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }

    User.findOne({
        username:username
    },function (err,user) {
        
        if(err){
            throw err;
        }

        if(!user){
            responseData.code = -2;
            responseData.message = '用户不存在'
            res.json(responseData);
            return;
        }

        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(isMatch && !err){
                var token = jwt.sign({name:user.username},config.secret,{
                    expiresIn:10080
                });
                user.token = token;
                user.save(function(error){
                    if(error){
                        res.send(error);
                        return;
                    }
                    responseData.code=4;
                    responseData.message = '登录成功';
                    // res.cookies.set('userInfo',JSON.stringify({
                    //     _id: user._id,
                    //     username: user.username
                    // }));
                    req.session.user = user;
                    res.json(responseData);

                });
                
                return;
            }
        });

    });
});

// passport-http-bearer token 中间件验证
// 通过 header 发送 Authorization -> Bearer  + token
// 或者通过 ?access_token = token
router.get('/users/info',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json({username: req.user.username});
});

// 返回数据
module.exports = router;