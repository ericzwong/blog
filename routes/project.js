var fs = require('fs');
var path = require('path');

module.exports = function(app){

        app.get('/projects',function(req,res){
            //res.writeHead(200,{"Content-Type":"text/html"});
            //res.end(fs.readFileSync(path.join(__dirname,"../views/project.html"),'utf8'));
            res.render('projects',{"title":"曾经的项目"});
        });

};
