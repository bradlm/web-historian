var http = require('http');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  logs: path.join(__dirname, '../workers/logs')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = cb => {
  fs.readFile(paths.list, (err, sites) => {
    sites = sites.toString().split('\n');
    cb(sites);
  });
};

exports.isUrlInList = (endPoint, cb) => {
  exports.readListOfUrls(sites => {
    cb((() => {
      for (let i = 0; i < sites.length; i++) {
        if (sites[i].indexOf(endPoint) > -1) {
          return true;
        }
      }
      return false;
    })());
  });
};

exports.search = search = (folder, asset, cb) => {
  fs.readFile(folder + '/' + asset, 'utf8', cb);
};

exports.addUrlToList = (siteName, cb) => {
  fs.appendFile(paths.list, siteName + '\n', () => {
    cb ? cb() : null; 
  });
};

exports.isUrlArchived = (url, cb) => {
  search(paths.archivedSites, url, founnd => {
    cb ? cb(found) : null;
  });
};

exports.downloadUrls = cb => {
  exports.readListOfUrls(siteNames => {
    _.each(siteNames, site=> {
      http.get(site, res => {
        // html = res.body
        //write html to new file in sites/ with filename matching url
        // remove site from sites.txt list
      }).on('error', err => {
        fs.appendFile(paths.logs, err.message);
        exports.addUrlToList(site);
      });
    });
    cb ? cb() : null;
  });
};
