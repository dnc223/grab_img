$("#redditTop100").on('click', function(e) {
  e.preventDefault();
  $("#content").html("<div id='loading'><img src='images/loading.gif'></div>");
  $.getJSON("redditTop100", function(entries) {
    var items = [];
    entries.forEach(function(entry) {
      console.log(entry.url);
      var url = entry.url;
      var urlType = entry.urlType;
      var imgOrVid = entry.imgOrVid;
      if (imgOrVid === false) {
        $.ajax({
          method: 'POST',
          url: 'imgur',
          data: {url: url},
          dataType: 'json',
          success: function(urls) {
            urls.forEach(function(url) {
              if (url.urlType === 'img') {
                $("#content").append("<div class='image-container'><img src='" + url.url + "'></div>");
              } else {
                $("#content").append("<div class='image-container'><video autoplay loop><source type='video/mp4' src='" + url.url + "'></video></div>");
              }
            });
          }
        });
      } else {
        if (urlType === 'img') {
          items.push("<div class='image-container'><img src='" + url + "'></div>");
        } else {
          items.push("<div class='image-container'><video autoplay loop><source type='video/mp4' src='" + url + "'></video></div>");
        }
      }
    });
    $("#content").html(items.join(" "));
  });
});

$("#nav a").on('click', function(e) {
  e.preventDefault();
  $("#nav a").removeClass("selected");
  $(this).addClass("selected");
});