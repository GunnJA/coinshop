$( window ).load(function() {
   //let pollshareRoute = `${window.location.pathname}${window.location.search}`;
   let obj = $("#existingSpace").data("key");
   if (obj) {
        console.log("pollspace",obj);
        pollObjDisplay(obj);
   }
});