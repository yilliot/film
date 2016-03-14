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
      window.Main.backgroundPage.PresentWindow.setSlideContent(
        this.lyric.content1,
        1,
        this.backdrop,
        this.template
      );
    }
  },

  ready : function() {
  }

};