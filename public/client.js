let CC1;
let CC2;
let CC3;
let CC4;
let CC5;

$( window ).load(function() {
   //let pollshareRoute = `${window.location.pathname}${window.location.search}`;
   //let obj = $("#existingSpace").data("key");
  $.get(`/get/latest`, function(obj) {
    CC1 = obj;
  });
  $.get(`/get/CC2`, function(obj) {
    CC2 = obj;
  });
  $.get(`/get/CC3`, function(obj) {
    CC3 = obj;
  });
  $.get(`/get/CC4`, function(obj) {
    CC4 = obj;
  });
  $.get(`/get/CC5`, function(obj) {
    CC5 = obj;
  });
});

function displayData(arr1, arr2, arr3, arr4, arr5) {
  let newHTML = `<table class="tg"><tr><th class="tg-baqh" colspan="6">Coin Markets</th></tr>`;
  newHTML += `<tr><td class="tg-6k2t">MarketName</td><td class="tg-6k2t">Last Price</td></tr>`;
  $.each(arr1, function(key, value) {
    let item1 = arr1[key];
    let item2 = arr2[key];
    let item3 = arr3[key];
    let item4 = arr4[key];
    let item5 = arr5[key];
    newHTML += `<tr><td class="tg-6k2t">${item1.MarketName}</td>`;
    newHTML += `<td class="tg-6k2t">${item5.Last}</td>`;
    newHTML += `<td class="tg-6k2t">${item4.Last}</td>`;
    newHTML += `<td class="tg-6k2t">${item3.Last}</td>`;
    newHTML += `<td class="tg-6k2t">${item2.Last}</td>`;
    newHTML += `<td class="tg-6k2t">${item1.Last}</td></tr>`;
      //newHTML += `<li id="${itemID}poll"><button class="editButt" data-key="${item.name}" id="${itemID}editButt">${item.name}</button>`
    });
  newHTML += `</tr></table>`
  $("body").append(newHTML);
}