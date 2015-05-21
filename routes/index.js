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

//从数据库当中获取文章
function getArticle(paramsPage,callback){
    var page = 0;
    //设定每页显示五条
    var seek = 5;

    if((!isNaN(parseInt(paramsPage))) && parseInt(paramsPage) > 0){
        page = parseInt(paramsPage) - 1;
    }

    var startSeek = page * seek;

    mysqlConnection.query('SELECT article_id,container,modify_time,title FROM articles LIMIT ?,?',[startSeek,seek],function(err,result){
        if(err){
            return callback(new Error("从数据中获取失败"),null);
        }

        return callback(null,result);
    });
}

module.exports = function(app){

        app.get('/',function(req,res){

            getArticle(1,function(err,result){

                var content = "";

                if(err){
                    content = "<p>从数据库当中获取失败</p>";
                }else{
                    content = result;
                }

                res.render('index',{"content":content,"nextPage": 3,"prevPage":1,"title":"文章"});

            });


        });

        app.get('/page/:page',function(req,res){

            var paramsPage = req.params['page'];

            getArticle(paramsPage,function(err,result){

                var content = "";

                if(err){
                    content = "<p>从数据库当中获取失败</p>";
                }else{
                    content = result;
                }

                res.render('index',{"content":content,"nextPage": parseInt(paramsPage) + 1,"prevPage":paramsPage - 1,"title":"文章"});

            });
        });

        //获取所有的Article
        app.get('/ajax/article/all/page/:page',function(req,res){

            var paramsPage = req.params['page'];

            getArticle(paramsPage,function(err,result){
                if(err){
                    return res.end('{"msg":"从数据库当中获取失败"}');
                }

                return res.end('{"msg":"OK","data":' + JSON.stringify(result) + '}');
            });

        });

};
