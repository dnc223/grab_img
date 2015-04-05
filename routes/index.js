var express = require('express');
var router = express.Router();
var http = require('http');
var rest = require('restler');
var cheerio = require('cheerio');

router.get('/', function(req, res) {
  res.render('index');
});

urlRedditTop100 = 'http://reddit.com/.json?limit=100'

router.get('/redditTop100', function(req, res) {
  items = [];
  rest.get(urlRedditTop100).on('complete', function(reddit) {
    var entries = reddit.data.children;
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
          
          items.push({imgOrVid: false, url: url});
        }
      }
    });
    res.setHeader('Content-Type', 'application/json');
    res.json(items);
  });
});

router.post('/imgur', function(req, res) {
  var url = req.body.url;
  console.log(url);
  var result = [];
  rest.get(url).on('complete', function(imgur) {
    var $ = cheerio.load(imgur);
    var images = $('#image').find('img');
    images.each(function(index, image) {
      var url = image.attribs.src;
      var ext = url.split('.').pop();
      if (ext === 'webm') {
        var urlType = 'vid';
      } else {
        var urlType = 'img';
      }
      result.push({url: 'http:' + url, urlType: urlType});
    });
    console.log(result);
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  });
});

module.exports = router;
