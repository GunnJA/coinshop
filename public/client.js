

$( window ).load(function() {
   //let pollshareRoute = `${window.location.pathname}${window.location.search}`;
   let obj = $("#existingSpace").data("key");
  $.get(`/get/all`, function(obj) {
    console.log(obj);
  });
});



