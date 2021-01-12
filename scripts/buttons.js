$(".button").click(function() {
    attr = $(this).attr("url");
    if (typeof attr !== typeof undefined && attr !== false) {
        window.location.href = $(this).attr("url");
    }
  });