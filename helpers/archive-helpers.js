var http = require('http');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

exports.paths = paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    paths[type] = path;
  });
};

//read asset at a given location and process in callback
exports.read = read = (folder, asset, cb) => {
  fs.readFile(folder + '/' + asset, 'utf8', cb);
};

exports.readListOfUrls = readListOfUrls = cb => {
  fs.readFile(paths.list, (err, data) => { //data = listed sites
    cb(data.toString().split('\n'));
  });
};

exports.isUrlInList = (url, cb) => {
  readListOfUrls(sites => {
    for (let i = 0; i < sites.length; i++) {
      if (sites[i].indexOf(url) > -1) {
        return cb(true);
      }
    }
    cb(false);
  });
};

//adds a url to the list. optional callback executed after.
exports.addUrlToList = addUrlToList = (url, cb) => {
  fs.appendFile(paths.list, url + '\n', () => {
    cb && cb(); 
  });
};

//check if url is archived. passes bool to a cb
exports.isUrlArchived = isUrlArchived = (url, cb) => {
  read(paths.archivedSites, url, err => {
    cb(!err);
  });
};

exports.downloadUrls = (siteArr, cb) => {
  siteArr.forEach(site => { 
    isUrlArchived(site, archived => { //check if file exists
      if (!archived) {
        console.log(site); //LOGGING SITE TO CONSOLE
        http.get('http://' + site, res => { //NOT YET WORKING 
          res.on('data', chunk => {
            cb(site, chunk.toString());
          });
        }).on('error', err => {
          console.log('Error:' + err.message);
        });
      }
    });
  });
};
