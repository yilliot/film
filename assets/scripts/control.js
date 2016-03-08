window.Myvue = {
  vueObj : null,

  init : function() {
    Vue.config.debug = true;
    Vue.use(VueAsyncData);

    this.vueObj = new Vue({
      el : '#myvue',

      data : {
        song_list : [1,2,3],
        db_lyrics : [],
        db_tracks : [],
        db_arrange_groups : [],
        db_arranges : [],
        db_placeholders : [],
        db_lyric_groups : [],
        db_templates : [],
        db_songs : [],
        db_backdrops : [],
        current_slide_id : 2,
        state : 'review' // layout, review, show, song
      },

      components : {
        'song-list-item' : require('song-list-item/song-list-item'),
        'arrange-track' : require('arrange-track/arrange-track')
      },

      events : {},

      ready : function() {
        var vue = this;

        var getCb = function(name, item){
          Myvue.vueObj.$set(name, item);
          // console.log(name);
          // console.log(item);
        };
        window.DB.getAllItems('db_lyrics', getCb);
        window.DB.getAllItems('db_tracks', getCb);
        window.DB.getAllItems('db_arrange_groups', getCb);
        window.DB.getAllItems('db_arranges', getCb);
        window.DB.getAllItems('db_placeholders', getCb);
        window.DB.getAllItems('db_lyric_groups', getCb);
        window.DB.getAllItems('db_songs', getCb);
        window.DB.getAllItems('db_templates', getCb);
        window.DB.getAllItems('db_backdrops', getCb);
      },

      methods : {

        // click event
        go_show : function () {
          this.state = 'show';
          window.Displays.show();
        },
        go_review : function () {
          this.state = 'review';
          window.Displays.stop();
        },
        go_layout : function () {
          this.state = 'layout';
          window.Displays.stop();
        },

        // child event
        getSlideDetails : function(slide, resolve) {
          window.DB.db.templates.where(':id').equals(slide.template_id)
            .first()
            .then(function(item){
              resolve({
                'template' : item
              });              
            });
          window.DB.db.backdrops.where(':id').equals(slide.backdrop_id)
            .first()
            .then(function(item){
              resolve({
                'backdrop' : item
              });              
            });

        },

        getTrackTitle: function(track, resolve) {
          window.DB.db.songs.where(':id').equals(track.song_id)
            .first()
            .then(function(item){
              resolve({
                'title' : item.title
              });              
            });
        },

        getArranges: function(track, _resolve) {

          var db = window.DB.db;

          // get arranges
          db.arranges.where(':id').equals(track.song_id)
            .first()
            .then(function(arrange){
              // get groups
              var arrange_groups = db.arrange_groups.where('arrange_id').equals(arrange.id)
                .toArray();

              return arrange_groups;
            }).then(function(arrange_groups){

              _resolve({
                arrange_groups : arrange_groups
              });
              var fn = function(item){
                return db.lyric_groups.where(':id').equals(item.lyric_group_id).first();
              };
              var actions = arrange_groups.map(fn);
              return Promise.all(actions)

            }).then(function(lyric_groups){

              var fn = function(item) {
                return db.lyrics.where('lyric_group_id').equals(item.id).toArray();
              }
              var actions = lyric_groups.map(fn);

              return Promise.all(actions)

            }).then(function(lyrics){
              _resolve({groups:lyrics});
            });
        }
      }
    });
  }
};

window.DB = {

  db : {},

  init : function (callback) {
    const DB_NAME = 'FILM';

    this.db = new Dexie(DB_NAME);
    this.migrate(callback);

  },

  getItem : function (name, key, callback) {
    var storeName = name.replace('db_', '');
    var trans = this.db.transaction(storeName, IDBTransaction.READ_ONLY);
    var store = trans.objectStore(storeName);
    var request = store.get(key);

    request.onerror = function(event) {
      console.error(event);
    };
    request.onsuccess = function(event) {
      callback(event.target.result);
    };

  },

  getAllItems : function (name, callback) {

    var storeName = name.replace('db_', '');
    var items = {};
    this.db[storeName].toArray().then(function(items){
      callback(name, items);
    });
  },

  migrate : function (callback) {

    const DB_VERSION = 2;

    var migs = [
      require('migrations/001')
    ];

    var stores = {};

    for(var i in migs) {
      var mig = migs[i].mig;
      for(var j in mig) {
        stores[j] = mig[j];
      }
    }

    this.db.version(DB_VERSION).stores(stores);
    this.db.open().then(callback);

  },

  seed : function () {

    var db = this.db;

    var seeds = [
      require('seeds/songs'),
      require('seeds/lyric_groups'),
      require('seeds/lyrics'),
      require('seeds/tracks'),
      require('seeds/arranges'),
      require('seeds/arrange_groups'),
      require('seeds/templates'),
      require('seeds/backdrops')
    ];

    for(var i in seeds) {

      var seed = seeds[i];
      var store = db[seed.store];
      store.clear();

      for(var j in seed.data) {
        store.put(seed.data[j]);
      }
    }
  }
}

window.Displays = {

  objList : [],

  show : function () {
    var targetedDisplay = Displays.objList[$('#present-display-list').val()];
    Main.backgroundPage.PresentWindow.show(targetedDisplay.bounds);
  },

  stop : function () {
    Main.backgroundPage.PresentWindow.hide();
  },

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

window.Main = {

  backgroundPage : {},

  init : function() {
    chrome.runtime.getBackgroundPage(function(page){
      window.Main.backgroundPage = page;
    });
  },

  initEvent : function () {

    chrome.system.display.onDisplayChanged.addListener(Displays.updateList);
    window.Displays.updateList();

  },

  semantic : function() {
    $('.tabular.menu .item').tab();
  }
};



$(function(){

  Main.init();
  Main.initEvent();

  DB.init(function(){
    Myvue.init();
  });


  Main.semantic();

});