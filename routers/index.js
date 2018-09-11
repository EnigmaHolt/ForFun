module.exports = function(app){
    app.get('/',function(req,res){
      if(!req.session.user){
        res.redirect('/singin')
      }else{
        res.render('main.html');
      }
    });
    // 根据不同功能划分模块
    app.use('/admin',require('./admin'));
    app.use('/api',require('./api'));
    app.use('/home',require('./home'));
    app.use('/singin',require('./signin'))

    // 404 page
    app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  });
};