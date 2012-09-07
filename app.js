
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , users=require('./routes/users')
  , courses=require('./routes/courses')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/login',users.login);
app.get('/users',users.list);
app.get('/users/add',users.add);
app.get('/logout',users.logout);
app.post('/users/save',users.save);
app.post('/users/update',users.update);
app.get('/users/show/:role',users.show);
app.get('/users/edit/:username',users.edit);
app.get('/users/delete/:username',users.delete);


app.get('/courses/add',courses.add);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
