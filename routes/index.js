var express = require('express');
var router = express.Router();
var http = require('http');
var restler = require('restler');
var cheerio = require('cheerio');

router.get('/', function(req, res) {
  res.render('index');
});

urlRedditTop100 = 'http://reddit.com/.json?limit=100'

router.get('/redditTop100', function(req, res) {
  restler.get(urlRedditTop100).on('complete', function(reddit) {
    items = [];
    var entries = reddit.data.children.slice(1);
    var re_img = /gif$|png$|jpe?g$/;
    var re_gifv = /gifv$/;
    var re_imgur = /imgur\.com/;

    entries.forEach(function(entry) {
      var url = entry.data.url;
      if (entry.data.over_18 === false) {
        if (url.match(re_img)) {
          items.push({url: url, urlType: 'img'});
        } else if (url.match(re_gifv)) {
          url = url.replace(re_gifv, 'webm');
          items.push({url: url, urlType: 'vid'});
        } else if (url.match(re_imgur)) {
          var urlFromImgur = getFromImgur(url);
          if (urlFromImgur !== "") {
            urlFromImgur.forEach(function(url) {
              items.push(url);
            });
          }
        }
      }
    });
    res.setHeader('Content-Type', 'application/json');
    res.json(items);
  });
});

function getFromImgur(url) {
  restler.get(url).on('complete', function(imgur) {
    $ = cheerio.load(imgur);
    var result = [];
    var images = $("#image .image img");
    images.each(function(index, image) {
      if (index > 0) {
        console.log(image.attribs.src);
      }
      var url = image.attribs.src;
      if (url.split('.').pop() === 'gifv') {
        var urlType = 'vid';
      } else {
        var urlType = 'img';
      }
      result.push({url: url, urlType: urlType});
    })
    return result;
  });
  return "";
}

module.exports = router;
