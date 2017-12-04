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
    console.log("CC1",CC1.length);
  });
  $.get(`/get/CC2`, function(obj) {
    CC2 = obj;
        console.log("CC2",CC2.length);
  });
  $.get(`/get/CC3`, function(obj) {
    CC3 = obj;
        console.log("CC3",CC3.length);
  });
  $.get(`/get/CC4`, function(obj) {
    CC4 = obj;
        console.log("CC4",CC4.length);
  });
  let lastProm = new Promise(function(resolve,reject) {
    $.get(`/get/CC5`, function(obj) {
      //console.log("CC5",CC5.length);
      resolve(CC5 = obj);
    });
  });
  lastProm.then(function() {
    displayData(CC1,CC2,CC3,CC4,CC5);
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
    });
  newHTML += `</table>`;
  console.log(newHTML);
  $("body").append(newHTML);
}