var Myvue = {
  init : function() {
    Vue.config.debug = true;

    new Vue({
      el : '#myvue',

      computed : {
        hide_for_review : function() {
          return this.state !== 'review';
        },
        hide_for_show : function() {
          return this.state !== 'show';
        },
        hide_for_song : function() {
          return this.state !== 'song';
        }
      },

      data : {
        'hide_for_layout' : 'hide',
        state : 'layout' // review, show, song
      },

      methods : {},

      components : {},

      events : {},

      ready : function() {
        console.log(this.hide_for_layout);
      }
    });
  }
};

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
  },

  semantic : function() {
    $('.tabular.menu .item').tab();
  }
};



$(function(){

  Main.init();
  Main.initEvent();

  // app.js
  // Myvue.init();


  Main.semantic();

});