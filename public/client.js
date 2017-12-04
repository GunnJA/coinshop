

$( window ).load(function() {
   //let pollshareRoute = `${window.location.pathname}${window.location.search}`;
   //let obj = $("#existingSpace").data("key");
  $.get(`/get/all`, function(obj) {
    let newHTML = `<table class="tg"><tr><th class="tg-baqh" colspan="6">Coin Markets</th></tr>`;
    $.each(obj, function(key, value) {
      let item = obj[key];
      newHTML += `<tr><td class="tg-6k2t">${item.MarketName}</td><td class="tg-6k2t">${item.Last}</td></tr>`;
      //newHTML += `<li id="${itemID}poll"><button class="editButt" data-key="${item.name}" id="${itemID}editButt">${item.name}</button>`
      });
  newHTML += `</tr></table>`
  $("body").append(newHTML);
  });
});


