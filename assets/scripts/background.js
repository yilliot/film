var controlwin;

function broadcast(text){
  PresentWindow.windowObj.contentWindow.post(text);
}

var PresentWindow = {
  windowObj : {},
  init : function() {},
  show : function(bounds) {
    PresentWindow.windowObj.contentWindow.Broadcast.show(bounds);
  },
  hide : function() {
    PresentWindow.windowObj.contentWindow.Broadcast.hide();
  }
}

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("html/present.html",
    { 
      id: "presentwin",
      frame: "none",
      hidden: true,
    }, function(win) {
      PresentWindow.windowObj = win;
    }
  );
  chrome.app.window.create("html/control.html",
    {
      id: "controlwin",
      state : 'maximized'
    }, function(win) {
      controlwin = win;
    }
  );

});

