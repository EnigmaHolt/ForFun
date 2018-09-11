

var mongoose = require('mongoose');

// 地址的表结构
module.exports = new mongoose.Schema({
    // 地址名
    addressName:String,
    // 具体地址
    addressDetail:String,
    // 用户id
    userId:Number
})