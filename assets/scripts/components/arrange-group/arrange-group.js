module.exports = {

  template : require('./arrange-group.template.html'),

  'props' : ['group', 'arrange'],


  data : function () {
    return {
    };
  },

  computed : {
    label : function() {
      var label_color = '';
      switch (this.group.type) {
        case 'verse' : label_color = 'olive'; break;
        case 'pre_chorus' : label_color = 'green'; break;
        case 'chorus' : label_color = 'teal'; break;
        case 'bridge' : label_color = 'blue'; break;
      }
      return label_color;
    }
  },


  components : {
    'arrange-slide' : require('arrange-slide/arrange-slide')
  },

  methods : {
    getSlideDetails : function(lyric, resolve) {
      this.$parent.getSlideDetails(lyric, resolve);
    }
  },

  ready : function () {
  }
};