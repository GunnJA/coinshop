

$( window ).load(function() {
   //let pollshareRoute = `${window.location.pathname}${window.location.search}`;
   //let obj = $("#existingSpace").data("key");
  $.get(`/get/all`, function(obj) {
    let newHTML = `<ul id="polls">List of Coins:<br>`;
    $.each(obj, function(key, value) {
      itemID -= 1;
      let item = data[itemID];
      newHTML += `<li id="${itemID}poll"><button class="editButt" data-key="${item.name}" id="${itemID}editButt">${item.name}</button>`
      newHTML += `<button class="delButt" data-key="${item.name}" id="${itemID}delButt" ${hide}>Delete</button></li>`
      });
  });
});


