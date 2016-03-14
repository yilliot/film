window.Myvue = {
  vueObj : null,

  init : function() {
    Vue.config.debug = true;
    Vue.use(VueAsyncData);

    this.vueObj = new Vue({
      el : '#myvue',

      data : {
        db_lyrics : [],
        db_tracks : [],
        db_arrange_groups : [],
        db_arranges : [],
        db_placeholders : [],
        db_lyric_groups : [],
        db_templates : [],
        db_songs : [],
        db_backdrops : [],
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
        };
        window.DB.getAllItems('db_tracks', getCb);
        window.DB.getAllItems('db_songs', getCb);
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
        getSlideDetails : function(lyric, resolve) {
          window.DB.db.templates.where(':id').equals(lyric.template_id)
            .first()
            .then(function(item){
              resolve({
                'template' : item
              });
            });
          window.DB.db.backdrops.where(':id').equals(lyric.backdrop_id)
            .first()
            .then(function(item){
              resolve({
                'backdrop' : item
              });
            });
        },

        getSong: function(track, resolve) {
          window.DB.db.songs.where(':id').equals(track.song_id)
            .first()
            .then(function(item){
              resolve({
                'song' : item
              });              
            });
        },
        getArrange: function(track, resolve) {
          window.DB.db.arranges.where(':id').equals(track.arrange_id)
            .first()
            .then(function(item){
              resolve({
                'arrange' : item
              });              
            });
        },

        getGroups: function(track, resolve) {

          var db = window.DB.db;

          // get arranges
          db.arrange_groups.where(':id').equals(track.arrange_id)
            .first()
            .then(function(arrange){
              // get groups
              db.arrange_groups.where('arrange_id').equals(arrange.id)
                .toArray(function(groups){
                  resolve({
                    groups : groups
                  });
                });
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

    this.db.on("populate", function() {
      DB.seed();
    });
    this.db.open().then(callback);

  },

  seed : function () {

    var db = this.db;

    var seeds = [
      require('seeds/songs'),
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

  nowShowing : {
    content001 : '',
    template : '',
    backdrop : '',
    speed : 0
  },

  show : function () {
    var targetedDisplay = Displays.objList[$('#present-display-list').val()];
    Main.backgroundPage.PresentWindow.show(targetedDisplay.bounds);
  },

  stop : function () {
    Main.backgroundPage.PresentWindow.hide();
  },

  updateShow : function () {
    var nowShowing = window.Displays.nowShowing;
    console.log(nowShowing);
    window.Main.backgroundPage.PresentWindow.setSlideContent(
      nowShowing.content001,
      nowShowing.index,
      nowShowing.backdrop,
      nowShowing.template
    );
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

    $(document).keydown(function(event) {
      console.log(event.which);
      switch(event.which) {
        case 66: window.Navigator.blackout(); break; // b : blackout
        case 48: window.Navigator.removeText(); break;  // 0 : remove text
        case 37: window.Navigator.goPrevCard(); break;
        case 38: window.Navigator.goPrevGroup(); break;
        case 39: window.Navigator.goNextCard(); break;
        case 40: window.Navigator.goNextGroup(); break;
      }
    });

  },

  semantic : function() {
    $('.tabular.menu .item').tab();
  }
};

window.Navigator = {
  blackout : function() {
    window.Displays.nowShowing.content001 = '';
    window.Displays.nowShowing.backdrop = null;
    window.Displays.updateShow();
  },
  removeText : function() {
    window.Displays.nowShowing.content001 = '';
    window.Displays.updateShow();
  },
  goNextCard : function() {
    $currentCard = $('.card.active');
    $nextCard = $('.card.active').next('.card');
    if ($nextCard.length) {
      $currentCard.removeClass('active').next('.card').addClass('active');
    }
  },
  goPrevCard : function() {
    $currentCard = $('.card.active');
    $nextCard = $('.card.active').prev('.card');
    if ($nextCard.length) {
      $currentCard.removeClass('active').prev('.card').addClass('active');
    }
  },
  goNextGroup : function() {
    $currentCard = $('.card.active');
    $nextGroup = $('.card.active').closest('.cards').next('.cards');
    if ($nextGroup.length) {
      $currentCard.removeClass('active');
      $nextGroup.children('.card:first').addClass('active');
    }
  },
  goPrevGroup : function() {
    $currentCard = $('.card.active');
    $nextGroup = $('.card.active').closest('.cards').prev('.cards');
    if ($nextGroup.length) {
      $currentCard.removeClass('active');
      $nextGroup.children('.card:first').addClass('active');
    }
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