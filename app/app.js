var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon('./public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')('./public'));
app.use(express.static('./public'));

app.use('/getGameList', require('./routes/getGameList'));
app.use('/getGameInfo', require('./routes/getGameInfo'));
app.use('/getUserList', require('./routes/getUserList'));
app.use('/getAllGameReviews', require('./routes/getAllGameReviews'));
app.use('/getAllUserReviews', require('./routes/getAllUserReviews'));
app.use('/getSystemList', require('./routes/getSystemList'));
app.use('/getGameSystemList', require('./routes/getGameSystemList'));
app.use('/getUserDetails', require('./routes/getUserDetails'));
app.use('/getUserGameStatus', require('./routes/getUserGameStatus'));
app.use('/getUserGameList', require('./routes/getUserGameList'));
app.use('/getUserGameReview', require('./routes/getUserGameReview'));
app.use('/register', require('./routes/register'));
app.use('/searchGame', require('./routes/searchGame'));
app.use('/searchUser', require('./routes/searchUser'));
app.use('/searchEmail', require('./routes/searchEmail'));
app.use('/setUserGameStatus', require('./routes/setUserGameStatus'));
app.use('/setUserGameReview', require('./routes/setUserGameReview'));
app.use('/setUserGameRating', require('./routes/setUserGameRating'));
app.use('/loginAuth', require('./routes/loginAuth'));
app.use('/verifyToken', require('./routes/verifyToken'));

app.use('/', require('./routes/index'));
//app.use('/users', users);
console.log('Node is installed');
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//setting jwt token
//app.set('jwtTokenSecret', 'token');
app.set('jwtTokenSecret', process.env.AWS_TOKEN_SECRET);
module.exports = app;
