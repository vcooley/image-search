var config = require('../config')
var Bing = require('node-bing-api')({ accKey: config.bingApiKey });

imageSearchThunk = function(options) {
  return new Promise(function (resolve, reject) {
    Bing.images(options.query, {
      top: options.top,
      skip: options.offset || 0
    }, function(err, res, body) {
      if (err) { return reject(err); }
      var mappedResults = body.d.results.map(result => {
        return {
          Title: result.Title,
          MediaUrl: result.MediaUrl,
          SourceUrl: result.SourceUrl,
          DisplayUrl: result.DisplayUrl,
          Width: result.Width,
          Height: result.Height,
          FileSize: result.FileSize,
          Thumbnail: result.Thumbnail.MediaUrl
        }
      })
      response = {
        total: mappedResults.length,
        offset: options.offset,
        results: mappedResults
      }
      resolve(response);
    })
  })
};

module.exports = function *(next) {
  var query = this.query;
  var options = {
    query: query.query,
    top: 10,
    offset: query.offset
  };
  if (!options.query) {
    this.status = 400;
    this.body = 'You must enter a query parameter.';
    return;
  }
  else {
    this.body = yield imageSearchThunk(options);
  }
  yield next;
}