var backgroundPage;

window.onload = function() {
  chrome.runtime.getBackgroundPage(function(page){
    backgroundPage = page;
  });
}

$(function(){
  $('#textbox').blur(function(){
    backgroundPage.broadcast($('#textbox').val());
  });
});