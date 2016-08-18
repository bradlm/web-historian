var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var fs = require('fs');
var util = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      util.serveClient(res);
    } else {
      util.serveAssets(res, req.url, function(err, data) {
        if (err) {
          console.log('error: ', err);
        } else {
          res.writeHead(200, exports.headers);
          res.end(data);
        }
      });
    }
  } else if (req.method === 'OPTIONS') {
    util.sendResponse(res, null);
  } else if (req.method === 'POST') {

  } else {
    util.sendResponse(res, null, 404);
  }

  //res.end(archive.paths.list);
};
