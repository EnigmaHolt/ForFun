
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 用户的表结构
var UserSchema = new mongoose.Schema({
    // 用户名
    username:{
        type:String,
        unique:true,
        require:true},
    // 密码
    password: {
        type: String,
        require: true
      },
      token: {
        type: String
      }

});

// 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// 校验用户输入密码是否正确
UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = UserSchema;