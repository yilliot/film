var Displays = {

  objList : [],

  updateList : function () {

    chrome.system.display.getInfo(function(displays) {

      $('#present-display-list').html('');

      for (var i = displays.length - 1; i >= 0; i--) {
        var display = displays[i];

        Displays.objList[display.id] = display;

        if (display.isPrimary) {
          $('#present-display-list')
              .append($("<option></option>")
              .attr("value", display.id)
              .text('Primary'));
        } else {
          $('#present-display-list')
              .append($("<option></option>")
              .attr("value", display.id)
              .text('Secondary'));
        }
      }
    });
  }

};

var Main = {

  backgroundPage : {},

  init : function() {
    chrome.runtime.getBackgroundPage(function(page){
      Main.backgroundPage = page;
    });
  },

  initEvent : function () {

    chrome.system.display.onDisplayChanged.addListener(Displays.updateList);
    Displays.updateList();

    $('#present-button').click(function(){

      var targetedDisplay = Displays.objList[$('#present-display-list').val()];
      Main.backgroundPage.PresentWindow.show(targetedDisplay.bounds);
    })

    $('#hide-button').click(function(){

      Main.backgroundPage.PresentWindow.hide();
    })

    $('#textbox').blur(function(){
      Main.backgroundPage.broadcast($('#textbox').val());
    });
  }
};



$(function(){

  Main.init();
  Main.initEvent();

});