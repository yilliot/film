var Broadcast = {
  setContent : function(content, index) {
    var content001 = $('#content00'+index);
    var speed = content001.attr('speed');
    content001.fadeOut(100, function(){
      $(this).text(content).fadeIn(100);
    });
  },
  setBackdrop : function(backdrop) {
    var backdropPath = '/store/loops/'+backdrop.path;
    if ($('#backdrop').attr('src') != backdropPath) {
      $('#backdrop').attr('src', backdropPath);
    }
  },
  setTemplate : function(template) {
    var content001 = $('#content00'+index); 
    content001.removeClass().addClass(template.title);
    content001.attr('speed', template.speed);
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