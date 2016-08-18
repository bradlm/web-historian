var path = require('path');
var archive = require('../helpers/archive-helpers');
var utils = require('./http-helpers');
var url = require('url');

var actionMap = {
  GET: (req, res) => {
    let reqUrl = url.parse(req.url);
    let endPoint = reqUrl.pathname === '/' ? '/index.html' : reqUrl.pathname;
    utils.assetSrv(res, endPoint);
  },
  POST: (req, res) => {
    utils.resPrep(req, data => {
      // TODO: handle http(s):// cases
      let siteName = data.split('=')[1];
      archive.isUrlInList(siteName, urlFound => {
        if (urlFound) {
          archive.isURLArchived(siteName, urlArchived => {
            if (urlArchived) {
              utils.redirect(res, '/' + siteName);
            } else {
              utils.redirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(siteName, () =>{
            utils.redirect(res, '/loading.html');
          });
        }
      });
    });
  },
  OPTIONS: (req, res) => {
    utils.resSend(res);
  }
};

exports.handleRequest = (req, res) => {
  var action = actionMap[req.method];
  action ? action(req, res) : utils.errSend(res, 'Bad Request', 400);
};