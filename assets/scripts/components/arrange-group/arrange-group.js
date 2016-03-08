module.exports = {

  template : require('./arrange-group.template.html'),

  'props' : ['group'],

  components : {
    'arrange-slide' : require('arrange-slide/arrange-slide')
  },

  ready : function () {
  }
};