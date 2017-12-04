let CC1;
let CC2;
let CC3;
let CC4;
let CC5;

$( window ).load(function() {
   //let pollshareRoute = `${window.location.pathname}${window.location.search}`;
   //let obj = $("#existingSpace").data("key");
  $.get(`/get/latest`, function(arr) {
    CC1 = arr;
    console.log("CC1",CC1.length);
  });
  getData("CC2").then(function(obj2) {
    CC2 = toObject(obj2);
    console.log(CC2);
    getData("CC3").then(function(obj3) {
      CC3 = toObject(obj3);
      getData("CC4").then(function(obj4) {
        CC4 = toObject(obj4);
        getData("CC5").then(function(obj5) {
          CC5 = toObject(obj5);
          console.log("CC5",CC5);
          displayData(CC1,CC2,CC3,CC4,CC5);
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

function toObject(arr) {
  var newObj = {};
  for (var i = 0; i < arr.length; ++i) {
    let name = arr[i].MarketName;
    newObj[name] = arr[i];
  }
  return newObj;
}

function displayData(arr1, obj2, obj3, obj4, obj5) {
  let newHTML = `<table class="tg"><tr><th class="tg-baqh" colspan="6">Coin Markets</th></tr>`;
  newHTML += `<tr><td class="tg-6k2t">MarketName</td><td class="tg-6k2t">Last Price</td></tr>`;
  $.each(arr1, function(key, value) {
    let item1 = arr1[key];
    let item1Name = item1.MarketName;
    let item2 = obj2[item1Name];
    let item3 = obj3[item1Name];
    let item4 = obj4[item1Name];
    let item5 = obj5[item1Name];
    newHTML += `<tr><td class="tg-6k2t">${item1.MarketName}</td>`;
    newHTML += `<td class="tg-6k2t">${item5.Last}</td>`;
    newHTML += `<td class="tg-6k2t">${Math.round(((item4.Last - item5.Last)/item5.Last)*1000)}</td>`;
    newHTML += `<td class="tg-6k2t">${item4.Last}</td>`;
    newHTML += `<td class="tg-6k2t">${item3.Last}</td>`;
    newHTML += `<td class="tg-6k2t">${item2.Last}</td>`;
    newHTML += `<td class="tg-6k2t">${item1.Last}</td></tr>`;
    });
  newHTML += `</table>`;
  $("body").append(newHTML);
}