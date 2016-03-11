module.exports = {

  template : require('./arrange-slide.template.html'),

  data : function () {
    return {
      template : {},
      backdrop : {},
      is_current_slide : false,
    };
  },

  props : ['lyric'],

  asyncData : function(resolve, reject) {
    this.$parent.getSlideDetails(this.lyric, resolve);
  },

  methods : {
    scream : function() {
      this.$parent.$parent.$parent.current_slide_id = this.lyric.id;
      window.Main.backgroundPage.PresentWindow.setSlideContent(
        this.lyric.content1,
        1,
        this.backdrop,
        this.template
      );
    }
  }

};