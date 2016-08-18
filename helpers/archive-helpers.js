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
    cb((() => {
      for (let i = 0; i < sites.length; i++) {
        if (sites[i].indexOf(url) > -1) {
          return true;
        }
      }
      return false;
    })());
  });
};

//adds a url to the list. optional callback executed after.
exports.addUrlToList = addUrlToList = (siteName, cb) => {
  fs.appendFile(paths.list, siteName + '\n', () => {
    cb ? cb() : null; 
  });
};

//check if url is archived. passes bool to a cb
exports.isUrlArchived = isUrlArchived = (url, cb) => {
  read(paths.archivedSites, url, err => {
    cb(!Boolean(err));
  });
};

exports.downloadUrls = cb => {
  readListOfUrls(siteNames => {
    siteNames.forEach(site => {
      isUrlArchived(site, archived => {
        if (!archived) {
          http.get(site, res => {
//example html get:
// http.get('http://www.google.com/index.html', (res) => {
//   console.log(`Got response: ${res.statusCode}`);
//   // consume response body
//   res.resume();
// }).on('error', (e) => {
//   console.log(`Got error: ${e.message}`);
// });

//need to write html to new file in sites
//do we need to remove archived sites from the list? would require refactor but might be less complex.
          }).on('error', err => {
            console.log(err.message);
          });
        }
      });
    });
    cb ? cb() : null; //optional callback
  });
};
