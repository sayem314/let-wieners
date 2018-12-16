#!/usr/bin/env node

const { fetchPost } = require('./index');
const linkifyjs = require('linkifyjs');
const _ = require('lodash');

function flatten (arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
};

function printWiener (item) {
  console.log('\nWinner @'+item.InsertName);
  console.log('https://www.lowendtalk.com/discussion/comment/'+item.CommentID+'#Comment_'+item.CommentID);
};

async function wieners (url, repeat) {
  try {
  	var data = await fetchPost(url);
    var comments = data.Comments;
    if (comments) {
      var i = 1;
      while (comments.length < data.Discussion.CountComments) {
        i = i+1;
        let d = await fetchPost(data.Discussion.Url + '/p' + i, true);
        comments = comments.concat(d.Comments);
      };
      console.log('\n Total comments: ' + comments.length);
      comments = _.uniqBy(comments, 'InsertName');
      console.log('Unique comments: ' + comments.length);
      comments = comments.filter(x => x.InsertName !== data.Discussion.InsertName);

      var num = repeat > 0 ? repeat : 3;
      for(var i=0; i < num; i++) {
        let shuffle = _.shuffle(comments);
        let random = Math.floor(Math.random() * shuffle.length);
        printWiener(shuffle[random]);
      };
    } else {
      console.log('Unable to fetch the thread. Please try again later.');
      return 1;
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
