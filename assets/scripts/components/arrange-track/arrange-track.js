module.exports = {

  template : require('./arrange-track.template.html'),

  data : function() {
    return {
      'groups' : [],
      'arrange_groups' : [],
      'title' : 'loading...'
    };
  },

  props : ['track'],

  components : {
    'arrange-group' : require('arrange-group/arrange-group')
  },

  asyncData : function(resolve, reject) {
    this.$parent.getTrackTitle(this.track, resolve);
    this.$parent.getArranges(this.track, resolve);
  },

  methods : {

  },

  ready : function() {
  }

};