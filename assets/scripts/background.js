var controlwin;

var PresentWindow = {
  contentWindow : {},
  init : function() {},
  setContent : function(text, index) {
    this.contentWindow.Broadcast.setContent(text, index);
  },
  setBackdrop : function(backdrop) {
    this.contentWindow.Broadcast.setBackdrop(backdrop);
  },
  show : function(bounds) {
    this.contentWindow.Broadcast.show(bounds);
  },
  hide : function() {
    this.contentWindow.Broadcast.hide();
  }
}

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("html/present.html",
    { 
      id: "presentwin",
      frame: "none",
      hidden: true,
    }, function(win) {
      PresentWindow.contentWindow = win.contentWindow;
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

