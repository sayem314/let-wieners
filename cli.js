#!/usr/bin/env node

const { fetchPost } = require('./index');
const linkifyjs = require('linkifyjs');

function flatten (arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
};

function random (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

function printWiener (data) {
  let authorRregex = /(?<=title=\")[^\"]+/;
  let commentRegex = /(?<=discussion)[^\"]+/;
  let author = data.match(authorRregex);
  let comment = data.match(commentRegex);
  console.log('\nWinner @'+author);
  console.log('https://www.lowendtalk.com/discussion'+comment);
};

async function wieners (url, repeat) {
  const pattern = /<div class=\"Comment\">([\s\S]*?)<div class=\"Reactions\">/g;
  try {
  	let html = await fetchPost(url);
    let regex = /<a href=\"(.*)rel=\"next\">/;
    let next = await html.match(regex);
    let links = next ? await linkifyjs.find(next[0]) : [];

    if (links.length > 0) {
      var data = [];
      var result = links.reduce((unique, o) => {
          if(!unique.some(obj => obj.label === o.label && obj.value === o.value)) {
            unique.push(o);
          }
          return unique;
      },[]);
      for (var val of result) {
        let htm = await fetchPost(val.href, true);
        data.push(htm);
      };
    } else {
      var data = [html];
    };

    var comments = [];
    for (var val of data) {
      let comment = await val.match(pattern);
      comments.push(comment);
    };

    let merged = flatten(comments);
    let x = repeat ? repeat : 3;
    for (var i = 0; i < x; i++) {
      let choose = random(0, merged.length);
      printWiener(merged[choose]);
    };

  } catch (err) {
    console.log('Error occurred!');
    console.log(err);
  };
};

const arg = process.argv.slice(2);

if (arg.length == 0) {
  console.log("Usage: wieners url");
} else {
  if (arg[0].match('lowendtalk.com/discussion')) {
    wieners(arg[0], arg[1]);
  } else {
    console.log('Unsupported url: ' + arg[0]);
  };
};
