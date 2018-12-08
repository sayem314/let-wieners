const cloudscraper = require('cloudscraper');

function fetchPost (url, next) {
  url = next ? url : url.substr(0, url.lastIndexOf('/'));
  console.log('Fetching ' + url);
  return new Promise((resolve, reject) => {
    cloudscraper.get(url + '.json', function(error, response, body) {
      if (error) {
        return reject(error);
      } else {
        resolve(JSON.parse(body));
      };
    });

  });
};

module.exports = { fetchPost };
