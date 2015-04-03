var express = require('express');
var router = express.Router();
var http = require('http');
var restler = require('restler');

/* GET home page. */
//url = 'http://imgur.com/gallery/iltqnW1.json';
url = 'http://reddit.com/.json?limit=100'

router.get('/redditTop100', function(req, res) {
  restler.get(url).on('complete', function(reddit) {
    items = [];
    var entries = reddit.data.children.slice(1);
    var re_img = /gif$|png$|jpe?g$/;
    var re_gifv = /gifv$/;
    var re_imgur = /imgur.com/;

    entries.forEach(function(entry) {
      var url = entry.data.url;
      if (entry.data.over_18 === false) {
        if (url.match(re_img)) {
          items.push({url: url, urlType: 'img'});
        } else if (url.match(re_gifv)) {
          url = url.replace(re_gifv, 'webm');
          items.push({url: url, urlType: 'vid'});
        }
      }
    });
    res.setHeader('Content-Type', 'application/json');
    res.json(items);
  });
});

module.exports = router;
