module.exports = function(app){
        app.get('/about',function(req,res){
            res.render('about',{"title":"关于我"});
        });
};
