window.vue = {
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