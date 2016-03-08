module.exports = {

  template : require('./arrange-slide.template.html'),

  props : ['slide'],

  methods : {
    scream : function() {
      console.log('this.slide.content1');
    }
  }

};