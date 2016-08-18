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

exports.resSend = resSend = (res, data = null, status = 200) => {
  res.writeHead(status, headers);
  res.end(data);
};

exports.resPrep = (req, cb) => {
  var data = '';
  req.on('data', chunk => { 
    data += chunk; 
  });
  req.on('end', () => { 
    cb(data); 
  });
};

exports.errSend = errSend = (res, text = 'Not Found', status = 404) => {
  exports.resSend(res, text, status);
};

exports.assetSrv = (res, asset) => {
  let paths = archive.paths;
  let search = archive.search;
  search(paths.siteAssets, asset, (err, data) => { //no public asset
    if (err) {
      search(paths.archivedSites, asset, (err, data) => { //no archive asset
        if (err) {
          errSend(res); 
        } else { 
          resSend(res, data); 
        }
      });
    } else { 
      resSend(res, data); 
    }
  });
};

exports.redirect = (res, loc, status = 302) => {
  res.writeHead(status, { Location: loc });
  res.end();
};
