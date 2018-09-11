const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check_login_status').checkNotLogin;

router.get('/',checkNotLogin,function(req,res,next){
    res.render('signin.html');
});

module.exports = router;