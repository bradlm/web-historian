// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var archivePath = archive.paths.archivedSites;

//probably need some cron stuff in here
// exports.writeToArchive = writeToArchive = () => {
// 	archive.readListOfUrls(siteNames => { //get site readListOfUrls
// 		archive.downloadUrls(siteNames, (site, data) => {
// 			fs.writeFile(archivePath + '/' + site, data, 'utf8', err => {
// 				err && console.log('Error:' + err);
// 			});
// 		});
// 	});
// };