var express = require('express');
var router = express.Router();
var http = require('http');
var restler = require('restler');

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
            items.push(urlFromImgur);
          }
        }
      }
    });
    res.setHeader('Content-Type', 'application/json');
    res.json(items);
  });
});

function getFromImgur(url) {
  var hash = url.split("/").pop();
  var imgur = "http://imgur.com/" + "gallery/" + hash + ".json";
  console.log(imgur);
  restler.get(imgur).on('complete', function(imgurjson) {
    if (typeof imgurjson.data !== "undefined") {
      var imgurimage = imgurjson.data.image;
      if (imgurimage.is_album === false) {
        var imgururl = "http://i.imgur.com/" + hash + imgurimage.ext;
        var urlType;
        console.log(imgururl);
        if (imgurimage.ext === 'gifv') {
          urlType = 'vid';
        } else {
          urlType = 'img';
        }
        return {url: imgururl, urlType: urlType};
      }
    }
  });
  return "";
}

module.exports = router;
