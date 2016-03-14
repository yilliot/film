module.exports = {

  template : require('./arrange-slide.template.html'),

  data : function () {
    return {
      template : {},
      backdrop : {},
      is_current_slide : false,
      root : null
    };
  },

  props : ['lyric'],

  asyncData : function(resolve, reject) {
    this.$parent.getSlideDetails(this.lyric, resolve);
  },

  methods : {
    scream : function(event) {
      $('.cards .active.card').removeClass('active');
      $(event.target).closest('.card').addClass('active');
      window.Displays.nowShowing = {
        content001 : this.lyric.content1,
        index : 1,
        backdrop : this.backdrop,
        template : this.template
      };
      window.Displays.updateShow();
    }
  },

  ready : function() {
  }

};