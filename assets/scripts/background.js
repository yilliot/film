var presentwin, controlwin;

function broadcast(text){
  presentwin.contentWindow.post(text);
}
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("html/present.html",
    {  frame: "none",
       id: "presentwin",
       innerBounds: {
         width: 360,
         height: 300,
         left: 600,
         minWidth: 220,
         minHeight: 220
      }
    }, function(win) {
      presentwin = win;
    }
  );
  chrome.app.window.create("html/control.html",
    {  frame: "none",
       id: "controlwin",
       innerBounds: {
         width: 360,
         height: 300,
         left: 200,
         minWidth: 220,
         minHeight: 220
      }
    }, function(win) {
      controlwin = win;
    }
  );

});
