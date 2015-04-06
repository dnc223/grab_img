$("#redditTop100").on('click', function(e) {
  e.preventDefault();
  $("#content").html("<div id='loading'><img src='images/loading.gif'></div>");
  $.getJSON("redditTop100", function(entries) {
    $("#content").empty();
    entries.forEach(function(entry) {
      var url = entry.url;
      var urlType = entry.urlType;
      var imgOrVid = entry.imgOrVid;
      var title = entry.title;
      var permalink = entry.permalink;
      if (imgOrVid === false) {
        $.ajax({
          method: 'POST',
          url: 'imgur',
          data: {url: url, title: title, permalink: permalink},
          dataType: 'json',
          success: function(result) {
            var urls = result.urls;

            var titleContainer = "<div class='title-container'>" + result.title + "</div>";
            var permalinkContainer = "<div class='permalink-container'><a target='_blank' href='http://www.reddit.com" + result.permalink + "'>source</a></div>";
            var titleAndLink = titleContainer + permalinkContainer;
            var outerDiv = $("<div class='image-container'></div>");
            $(outerDiv).append(titleAndLink);
            
            urls.forEach(function(url) {
              if (url.urlType === 'img') {
                $(outerDiv).append("<img src='" + url.url + "'>");
              } else {
                $(outerDiv).append("<video autoplay loop><source type='video/mp4' src='" + url.url + "'></video>");
              }
            });
            if  (urls.length > 0) {
              $("#content").append(outerDiv);
            }
          }
        });
      } else {
        var titleContainer = "<div class='title-container'>" + title + "</div>";
        var permalinkContainer = "<div class='permalink-container'><a target='_blank' href='http://www.reddit.com" + permalink + "'>source</a></div>";
        var titleAndLink = titleContainer + permalinkContainer;
        if (urlType === 'img') {
          var imageContainer = "<div class='image-container'>" + titleAndLink + "<img src='" + url + "'></div>";
        } else {
          var imageContainer = "<div class='image-container'>" + titleAndLink + "<video autoplay loop><source type='video/mp4' src='" + url + "'></video></div>";
        }
        $("#content").append(imageContainer);
      }
    });
  });
});

$("#nav a").on('click', function(e) {
  e.preventDefault();
  $("#nav a").removeClass("selected");
  $(this).addClass("selected");
});
