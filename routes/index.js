var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var mysqlConnection = mysql.createConnection({
    host: "192.168.1.222",
    user: "nodetest",
    password: "19950128",
    database: "test"
});

mysqlConnection.connect();

module.exports = function(app){

        app.get('/',function(req,res){
            //res.writeHead(200,{"Content-Type":"text/html"});
            //res.end(fs.readFileSync(path.join(__dirname,'../views/index.html'),'utf8'));
            res.render('index');
        });

        app.get('/page/:page',function(req,res){
            //res.writeHead(200,{"Content-Type":"text/html"});
            //res.end(fs.readFileSync(path.join(__dirname,'../views/index.html'),'utf8'));
            res.render('index');
        });

        //获取所有的Article
        app.get('/ajax/article/all/page/:page',function(req,res){

            var paramsPage = req.params['page'];
            var page = 0;
            //设定每页显示五条
            var seek = 5;

            if((!isNaN(parseInt(paramsPage))) && parseInt(paramsPage) > 0){
                page = parseInt(paramsPage) - 1;
            }

            var startSeek = page * seek;

            mysqlConnection.query('SELECT article_id,container,modify_time,title FROM articles LIMIT ?,?',[startSeek,seek],function(err,result){
                if(err){
                    return res.end('{"msg":"从数据库当中获取失败"}');
                }

                return res.end('{"msg":"OK","data":' + JSON.stringify(result) + '}');
            });

        });

};
