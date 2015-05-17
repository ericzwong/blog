var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var resize = require('./libs/resize');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(resize);
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/index')(app);
require('./routes/project')(app);
require('./routes/about')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//错误处理页面
app.use(function(err,req,res,next){
    res.status(err.status || 500);
    res.render('error',{
        message: err.message,
        errorCode: err.status || 500
    });
});



module.exports = app;
