

$( window ).load(function() {
   //let pollshareRoute = `${window.location.pathname}${window.location.search}`;
   //let obj = $("#existingSpace").data("key");
  $.get(`/get/all`, function(obj) {
    let newHTML = `<table class="tg"><tr><th class="tg-baqh" colspan="6">Coin Markets</th></tr><tr>`;
    $.each(obj, function(key, value) {
      let item = obj[key];
      newHTML += `<td class="tg-6k2t">${item.MarketName}</td>`;
      //newHTML += `<li id="${itemID}poll"><button class="editButt" data-key="${item.name}" id="${itemID}editButt">${item.name}</button>`
      });
  
  $("body").append(newHTML);
  });
});


