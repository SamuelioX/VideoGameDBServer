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

app.use('/api/', require('./routes/index'));
app.use('/api/Games', require('./routes/getGameInfo'));
app.use('/api/AllGameReviews', require('./routes/getAllGameReviews'));
app.use('/api/AllUserReviews', require('./routes/getAllUserReviews'));
app.use('/api/Systems', require('./routes/getSystemList'));
app.use('/api/GameSystemList', require('./routes/getGameSystemList'));
app.use('/api/Users', require('./routes/getUserDetails'));
app.use('/api/UserGameStatuses', require('./routes/getUserGameStatus'));
app.use('/api/UserGameList', require('./routes/getUserGameList'));
app.use('/api/UserGameReviews', require('./routes/getUserGameReview'));
app.use('/api/Register', require('./routes/register'));
app.use('/api/Search', require('./routes/searchGame'));
app.use('/api/UserAvailability', require('./routes/searchUser'));
app.use('/api/EmailAvailability', require('./routes/searchEmail'));
app.use('/api/Auth', require('./routes/loginAuth'));
app.use('/api/Token', require('./routes/verifyToken'));

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
