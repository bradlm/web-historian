var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
  'Content-Type': 'text/html'
};

//sends response with optional data
exports.resSend = resSend = (res, data = null, status = 200) => {
  res.writeHead(status, headers);
  res.end(data);
};

//modifies response data when needed
exports.resPrep = (req, cb) => {
  var data = '';
  req.on('data', chunk => { 
    data += chunk; 
  });
  req.on('end', () => { 
    cb(data); 
  });
};

//error handler
exports.errSend = errSend = (res, text = 'Not Found', status = 404) => {
  resSend(res, text, status);
};

//serves assets if available
exports.assetSrv = (res, asset) => {
  let paths = archive.paths;
  let read = archive.read;
  read(paths.siteAssets, asset, (err, data) => { //check for public asset (index)
    err ? //if not public check for archive
      read(paths.archivedSites, asset, (err, data) => { //check for archive asset
        err ? errSend(res) : resSend(res, data); 
      })
    : resSend(res, data);
  });
};

//redirects
exports.redir = (res, loc, status = 302) => {
  res.writeHead(status, { Location: loc });
  res.end();
};
