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

    var request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = function(event) {
      // Do something with request.errorCode!
      console.error("openDb:", event.target.errorCode);
    };
    request.onsuccess = function(event) {
      // Do something with request.result!
      console.log("openDb DONE");
      DB.db = event.target.result;
    };

    // db migration and seed
    request.onupgradeneeded = function(event) {

      console.log("openDb.onupgradeneeded");

      var db = event.target.result;

      // library
      var os_song = db.createObjectStore("songs", { autoIncrement : true });
      var os_lyric_group = db.createObjectStore("lyric_groups", { autoIncrement : true });
      var os_lyric = db.createObjectStore("lyrics", { autoIncrement : true });
      var os_backdrop = db.createObjectStore("backdrops", { autoIncrement : true });
      var os_template = db.createObjectStore("templates", { autoIncrement : true });
      var os_placeholder = db.createObjectStore("placeholders", { autoIncrement : true });

      // arrangement
      var os_track = db.createObjectStore("tracks", { autoIncrement : true });
      var os_arrange = db.createObjectStore("arranges", { autoIncrement : true });
      var os_arrange_group = db.createObjectStore("arrange_groups", { autoIncrement : true });

      // indexes
      os_lyric_group.createIndex("song_id", "song_id", { unique : false });
      os_lyric.createIndex("song_id", "song_id", { unique : false });
      os_lyric.createIndex("lyric_group_id", "lyric_group_id", { unique : false });
      os_placeholder.createIndex('template_id', 'template_id', { unique : false });
      os_arrange_group.createIndex('arrange_id', 'arrange_id', { unique : false });

    };
  },

  seed : function () {

    var db = DB.db;
    // seed data
    var data_songs = [
      {
        title : "This is Amazing Grace",
        preview : "谁打破黑暗 和罪的大能... This is amazing grace... Worthy is the lamb who was slain"
      },{
        title : "耶稣我要爱慕你",
        preview : "耶稣 我要爱慕你... 我心满溢 我心满溢..."
      },{
        title : "Happy Day",
        preview : "在最伟大的那一天... Oh Happy day happy day... 哦 何等奇妙恩典..."
      },{
        title : "Breathe - Hillsong",
        preview : "这是我的气息... And I I\'m desperate for you..."
      }
    ];

    var os_song = db.transaction("songs", "readwrite").objectStore("songs");
    for (var i in data_songs) {
      console.log('seed : ' + data_songs[i].title);
      os_song.add(data_songs[i]);
    }

    var data_lyric_group = [
      {
        label : "verse 1",
        type : "verse",
        order : 0,
        song_id : 1
      }, {
        label : "verse 2",
        type : "verse",
        order : 1,
        song_id : 1
      }, {
        label : "chorus 1",
        type : "chorus",
        order : 2,
        song_id : 1
      }, {
        label : "verse 3",
        type : "verse",
        order : 3,
        song_id : 1
      }, {
        label : "bridge",
        type : "bridge",
        order : 4,
        song_id : 1
      }
    ];

    var os_lyric_group = db.transaction("lyric_groups", "readwrite").objectStore("lyric_groups");
    for (var i in data_lyric_group) {
      console.log('seed : ' + data_lyric_group[i].title);
      os_lyric_group.add(data_lyric_group[i]);
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