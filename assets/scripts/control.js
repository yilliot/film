var Myvue = {
  init : function() {
    Vue.config.debug = true;

    new Vue({
      el : '#myvue',

      data : {
        song_list : [1,2,3],
        state : 'layout' // review, show, song
      },

      methods : {},

      components : {
        'song-list-item' : require('song-list-item/song-list-item')
      },

      events : {},

      ready : function() {
      }
    });
  }
};

window.DB = {

  db : {},
  request : {},

  init : function () {
    const DB_NAME = 'FILM';
    const DB_VERSION = 2;

    // In the following line, you should include the prefixes of implementations you want to test.
    window.indexedDB = window.indexedDB || window.webkitIndexedDB;
    // DON'T use "var indexedDB = ..." if you're not in a function.
    // Moreover, you may need references to some window.IDB* objects:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

    this.request = window.indexedDB.open(DB_NAME, DB_VERSION);
    this.migrate();

  },

  migrate : function () {

    this.request.onerror = function(event) {
      // Do something with request.errorCode!
      console.error("openDb:", event.target.errorCode);
    };
    this.request.onsuccess = function(event) {
      // Do something with request.result!
      DB.db = event.target.result;
      console.log("openDb DONE");
    };

    var migs = [
      require('migrations/001')
    ];


    this.request.onupgradeneeded = function(event) {
      console.log("openDb.onupgradeneeded");
      for(var i in migs) {
        migs[i].migrate(event.target.result);
      }
    };
  },

  seed : function () {

    var db = this.db;

    var seeds = [
      require('seeds/songs'),
      require('seeds/lyric_groups'),
      require('seeds/lyrics')
    ];

    for(var i in seeds) {

      var seed = seeds[i]
      var store = db.transaction(seed.store, "readwrite").objectStore(seed.store);
      store.clear();

      for(var j in seed.data) {
        store.add(seed.data[j]);
      }
    }
  }
}

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

  DB.init();

  // app.js
  Myvue.init();


  Main.semantic();

});