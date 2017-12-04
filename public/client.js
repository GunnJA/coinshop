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
  getData("CC2").then(function(obj2) {
    CC2 = obj2;
    getData("CC3").then(function(obj3) {
      CC3 = obj3;
      getData("CC4").then(function(obj4) {
        CC4 = obj4;
        getData("CC5").then(function(obj5) {
          displayData(CC1,CC2,CC3,CC4,obj5);
        });
      });
    });
  });
});

function getData(CC) {
  return new Promise(function(resolve,reject) {
    $.get(`/get/${CC}`, function(obj) {
      //console.log("CC5",CC5.length);
      resolve(obj);
    });
  });
}

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
  $("body").append(newHTML);
}