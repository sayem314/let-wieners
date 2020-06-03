const hooman = require("hooman");

function fetchPost(url, next) {
  url = next ? url : url.substr(0, url.lastIndexOf("/"));
  console.log("Fetching " + url);
  return new Promise((resolve, reject) => {
    hooman
      .get(url + ".json", { responseType: "json" })
      .then((response) => {
        resolve(response.body);
      })
      .catch((error) => {
        return reject(error);
      });
  });
}

module.exports = { fetchPost };
