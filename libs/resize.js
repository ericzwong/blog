//用来调整图片大小
var sharp = require('sharp');
var path = require('path');
var fs = require('fs');

//定义一个Promise / Deffered

var Promise = function(){
    this.queue = [];
    this.isPromise = true;
};

Promise.prototype.then = function(fulfilledHandler,errorHandler){

        var handler = {};

        if(typeof fulfilledHandler === "function"){
            handler.fulfilled = fulfilledHandler;
        }

        if(typeof errorHandler === "function"){
            handler.error = errorHandler;
        }

        this.queue.push(handler);
        return this;
};

var Deffered = function(){
    this.promise = new Promise();
};

Deffered.prototype.resolve = function(data){

    var promise = this.promise;
    var handler;

    while((handler = promise.queue.shift())){
        if(handler && handler.fulfilled){
            var ret = handler.fulfilled(data);
            if(ret && ret.isPromise){
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }
};

Deffered.prototype.reject = function(err){


    var promise = this.promise;
    var handler;

    while((handler = promise.queue.shift())){
        if(handler && handler.error){
            var ret = handler.error(err);
            if(ret && ret.isPromise){
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }

};

Deffered.prototype.callback = function(){
    var self = this;
    return function(err,result){
        if(err){
            return self.reject(err);
        }
        self.resolve(result);
    }
};

var existsFile = function(filePath){
    var deffered = new Deffered();

    fs.exists(filePath,function(exists){
        if(!exists){
            return deffered.reject(new Error("No File"));
        }
        deffered.resolve(filePath);
    });

    return deffered.promise;
};

var makeDir = function(cachePhotoPath){
    var deffered = new Deffered();

    fs.mkdir(cachePhotoPath,function(err){
        if(err){
            return deffered.reject(err);
        }
        deffered.resolve(cachePhotoPath);
    });

    return deffered.promise;
}



module.exports = function(req,res,next){

    //匹配图片后缀
    if(req.path.match(/\.(png|jpeg|jpg)$/)){

        var needResize = true;
        var width = (parseInt(req.query['w']) <= 0 || isNaN(parseInt(req.query['w']))) ? 100 : parseInt(req.query['w']);
        var height = (parseInt(req.query['h']) <= 0 || isNaN(parseInt(req.query['h']))) ? 100 : parseInt(req.query['h']);

        var photoPath = path.join(__dirname,"../public",req.path);
        var photoName = path.basename(photoPath);
        var cachePhotoPath = path.join(__dirname,"../cache/images/" + width + "_" + height + "/" + photoName);

        var extname = path.extname(photoName);
        var contentType = "";
        if(extname === "jpg" || extname === "jpeg"){
            contentType = "image/jpeg";
        }else if(extname === "png"){
            contentType = "image/png";
        }

        existsFile(photoPath)
        .then(function(filePath){

            //判断Cache文件夹里面已经有当前的图片了
            return existsFile(cachePhotoPath);

        }).then(function(filePath){

            //因为已经是有图片了，所以直接输出
            needResize = false;
            res.writeHead(200, {'Content-Type': contentType});
            return res.end(fs.readFileSync(cachePhotoPath));

        },function(err){

            return existsFile(path.dirname(cachePhotoPath));

        }).then(function(filePath){

            //continue

        },function(err){

            //因为Cache 文件夹当中没有这个文件，所以需要创建
            return makeDir(path.dirname(cachePhotoPath));

        }).then(function(){

            //将文件保存到当中去
            if(needResize){
            sharp(photoPath)
            .resize(parseInt(width), parseInt(height))
            .toFile(cachePhotoPath,function(err){
                if(err){
                    console.log(err);
                    console.log("图片处理失败");
                }else{
                    res.writeHead(200, {'Content-Type': contentType});
                    return res.end(fs.readFileSync(cachePhotoPath));
                }
            }).on('error',function(err){
                conole.log(err);
            });
            }

        },function(err){
            //创建目录失败
            console.log("创建目录失败");
        });

        return;
    }

    next();
};
