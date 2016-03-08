module.exports = {

  template : require('./arrange-group.template.html'),

  'props' : ['group'],

  components : {
    'arrange-slide' : require('arrange-slide/arrange-slide')
  },

  methods : {
    getSlideDetails : function(slide, resolve) {
      this.$parent.getSlideDetails(slide, resolve);
    }
  },

  ready : function () {
  }
};