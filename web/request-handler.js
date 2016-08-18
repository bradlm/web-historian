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
      let siteName = data.split('=')[1];//extract url
      archive.isUrlInList(siteName, urlInList => {
        urlInList ? //is url in site list?
          archive.isURLArchived(siteName, urlInArchive => {
            urlInArchive ? //is listed url in archive?
              utils.redir(res, '/' + siteName) 
              : utils.redir(res, '/loading.html');
          })
          : archive.addUrlToList(siteName, () =>{
            utils.redir(res, '/loading.html');
            //need something to escape loading state once page is fetched
          });
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