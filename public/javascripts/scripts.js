$("#redditTop100").on('click', function(e) {
  e.preventDefault();
  $.getJSON("redditTop100", function(entries) {
    var items = [];
    console.log(items);
    entries.forEach(function(entry) {
      var url = entry.url;
      var urlType = entry.urlType;

      if (urlType === 'img') {
        items.push("<div class='image-container'><img src='" + url + "'></div>");
      } else {
        items.push("<div class='image-container'><video autoplay loop><source type='video/mp4' src='" + url + "'></video></div>");
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