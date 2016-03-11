module.exports = {

  template : require('./arrange-track.template.html'),

  data : function() {
    return {
      'song' : {},
      'arrange' : {},
      'groups' : [],
    };
  },

  props : ['track'],

  components : {
    'arrange-group' : require('arrange-group/arrange-group')
  },

  asyncData : function(resolve, reject) {
    this.$parent.getSong(this.track, resolve);
    this.$parent.getArrange(this.track, resolve);
    this.$parent.getGroups(this.track, resolve);
  },

  methods : {

    getSlideDetails : function(lyric, resolve) {
      this.$parent.getSlideDetails(lyric, resolve);
    }
  },

  ready : function() {
  }

};