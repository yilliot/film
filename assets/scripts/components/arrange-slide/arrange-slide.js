module.exports = {

  template : require('./arrange-slide.template.html'),

  data : function () {
    return {
      template : {},
      backdrop : {},
    };
  },

  props : ['slide'],

  asyncData : function(resolve, reject) {
    this.$parent.getSlideDetails(this.slide, resolve);
  },

  computed : {
    is_current_slide : function() {
      return this.$parent.$parent.$parent.current_slide_id == this.slide.id;
    }
  },

  methods : {
    scream : function() {
      this.$parent.$parent.$parent.current_slide_id = this.slide.id;
      window.Main.backgroundPage.PresentWindow.setContent(this.slide.content1, 1);
      window.Main.backgroundPage.PresentWindow.setBackdrop(this.backdrop);
      console.log(this.template);
    }
  }

};