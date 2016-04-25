'use strict';

var koa = require('koa');
var route = require('koa-route');
var fs = require('fs');

var app = koa();

var readFileForService = function(src) {
  return new Promise(function(resolve, reject) {
    fs.readFile(src, {'encoding': 'utf-8'}, function(err, data) {
      if (err) { return reject(err); }
      resolve(data);
    })
  })
}

var queries = [];

app.use(route.get('/api/search', require('./api/search')));

app.use(route.get('/api/search', function *(next) {
  if (queries.length >= 10) {
    queries = queries.slice(1, queries.length);
  }
  queries.push(
    {
      query: this.query.query, 
      when: Date.now()
    }
  );
}))

app.use(route.get('/api/latest', function *() {
  this.body = queries;
}));

app.use(route.get('/', function *() {
  this.body = yield readFileForService('./index.html');
}))

app.listen(process.env.PORT || 3000);