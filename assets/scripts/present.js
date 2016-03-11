var Broadcast = {
  setSlideContent : function(content, index, backdrop, template) {
    var content001 = $('#content00'+index);

    content001.fadeOut(template.speed, function(){
      $(this).text(content).fadeIn(template.speed);

      content001.removeClass().addClass(template.title);

      var backdropPath = '/store/loops/'+backdrop.path;
      if ($('#backdrop').attr('src') != backdropPath) {
        $('#backdrop').attr('src', backdropPath);
      }

    });



  },
  show : function(bounds) {
    chrome.app.window.current().show(false);
    chrome.app.window.current().outerBounds.left = bounds.left;
    chrome.app.window.current().outerBounds.top = bounds.top;
    chrome.app.window.current().outerBounds.width = bounds.width;
    chrome.app.window.current().outerBounds.height = bounds.height;
    chrome.app.window.current().fullscreen();
  },
  hide : function() {
    setTimeout(function(){chrome.app.window.current().hide();}, 501);
    chrome.app.window.current().restore();
  }
};


var Main = {

  init : function() {
  },
  initEvent : function() {
  }
};


$(function(){
  Main.init();
  Main.initEvent();
});