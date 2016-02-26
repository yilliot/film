function post(message)
{
  $('#text').html(message);
}


var Broadcast = {
  show : function(bounds) {
    chrome.app.window.current().show(false);
    chrome.app.window.current().outerBounds.left = bounds.left;
    chrome.app.window.current().outerBounds.top = bounds.top;
    chrome.app.window.current().outerBounds.width = bounds.width;
    chrome.app.window.current().outerBounds.height = bounds.height;
    chrome.app.window.current().fullscreen();
  },
  hide : function() {
    chrome.app.window.current().restore();
    chrome.app.window.current().hide();
  }
};


var Main = {
  backgroundPage : {},

  init : function() {
    chrome.runtime.getBackgroundPage(function(page){
      Main.backgroundPage = page;
    });
  },

  initEvent : function() {
    $(window).keydown(function(e){
      console.log(e);
    });
  }
};


$(function(){
  Main.init();
  Main.initEvent();
});