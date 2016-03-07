module.exports = {

  migrate : function(db) {

    // db.deleteObjectStore('songs');
    // db.deleteObjectStore('lyric_groups');
    // db.deleteObjectStore('lyrics');
    // db.deleteObjectStore('backdrops');
    // db.deleteObjectStore('templates');
    // db.deleteObjectStore('placeholders');
    // db.deleteObjectStore('tracks');
    // db.deleteObjectStore('arranges');
    // db.deleteObjectStore('arrange_groups');

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
  }
};