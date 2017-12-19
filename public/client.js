let CC1;
let CC2;
let CC3;
let CC4;
let CC5;

$( window ).load(function() {
   //let pollshareRoute = `${window.location.pathname}${window.location.search}`;
   //let obj = $("#existingSpace").data("key");
  recurring();
});

setInterval(recurring, 60000);


function recurring() {
  $.get(`/get/latest`, function(arr) {
    console.log("arr",arr)
    CC1 = arr.sort(function(a,b) {
      if (a.MarketName > b.MarketName) {
        return 1
      } else {
        return -1
      }
    });
  });
  getData("CC2").then(function(obj) {
    CC2 = obj;
    getData("CC3").then(function(obj) {
      CC3 = obj;
      getData("CC4").then(function(obj) {
        CC4 = obj;
        getData("CC5").then(function(obj) {
          CC5 = obj;
          if (!CC2) console.log("CC2 undefined");
          if (!CC3) console.log("CC3 undefined");
          if (!CC4) console.log("CC4 undefined");
          if (!CC5) console.log("CC5 undefined");
          //console.log("CC5",obj5);
          displayData(CC1,CC2,CC3,CC4,CC5);
        });
      });
    });
  });
}

function getData(CC) {
  return new Promise(function(resolve,reject) {
    $.get(`/get/${CC}`, function(obj) {
      //console.log("CC5",CC5.length);
      resolve(obj.data);
    });
  });
}

function toObject(arr) {
  var newObj = {};
  for (var i = 0; i < arr.length; ++i) {
    let name = arr[i].MarketName;
    newObj[name] = arr[i].Results;
  }
  //console.log("newObj",newObj);
  return newObj;
}

function genTVChart(marketName) {
  let nameArr = marketName.split("-");
  let nameStr = nameArr[1]+nameArr[0];
  return `https://www.tradingview.com/symbols/${nameStr}/`;
}


function bittrexURL(marketName) {
  return `https://bittrex.com/Market/Index?MarketName=${marketName}`;
}


function displayData(arr1, obj2, obj3, obj4, obj5) {
  if (!obj2) console.log("obj2 undefined");
  if (!obj3) console.log("obj3 undefined");
  if (!obj4) console.log("obj4 undefined");
  if (!obj5) console.log("obj5 undefined");
  let newHTML = `<div id="containerDiv"><table class="tg"><tr><th class="tg-baqh" colspan="23">Coin Markets</th></tr>`;
  newHTML += `<tr><td class="tg-6k2t">MarketName</td><td class="tg-6k2t">Fluc %</td><td class="tg-6k2t">Daily High</td><td class="tg-6k2t">Daily Low</td><td class="tg-6k2t">% > Low</td>`;
  newHTML += `<td class="tg-6k2t">Last Price(5)</td>`;
  newHTML += `<td class="tg-6k2t">TimeSpan(5)</td>`;
  newHTML += `<td class="tg-6k2t">RedditPosts(5)</td>`;
  newHTML += `<td class="tg-6k2t">B-S(5)</td><td class="tg-6k2t">Δ</td>`;
  newHTML += `<td class="tg-6k2t">Last Price(4)</td>`;
  newHTML += `<td class="tg-6k2t">TimeSpan(4)</td>`;
  newHTML += `<td class="tg-6k2t">RedditPosts(4)</td>`;
  newHTML += `<td class="tg-6k2t">B-S(4)</td><td class="tg-6k2t">Δ</td>`;
  newHTML += `<td class="tg-6k2t">Last Price(3)</td>`;
  newHTML += `<td class="tg-6k2t">TimeSpan(3)</td>`;
  newHTML += `<td class="tg-6k2t">RedditPosts(3)</td>`;
  newHTML += `<td class="tg-6k2t">B-S(3)</td><td class="tg-6k2t">Δ</td>`;
  newHTML += `<td class="tg-6k2t">Last Price(2)</td>`;
  newHTML += `<td class="tg-6k2t">TimeSpan(2)</td>`;
  newHTML += `<td class="tg-6k2t">RedditPosts(2)</td>`;
  newHTML += `<td class="tg-6k2t">B-S(2)</td><td class="tg-6k2t">Δ</td>`;
  newHTML += `<td class="tg-6k2t">Latest Price</td>`;
  newHTML += `<td class="tg-6k2t">TimeSpan</td>`;
  newHTML += `<td class="tg-6k2t">RedditPosts</td>`;
  newHTML += `<td class="tg-6k2t">Latest B-S</td></tr>`;
  $.each(arr1, function(key, value) {
    //console.log("arr1key", arr1[key]);
    let item1 = arr1[key];
    let item1Name = item1.MarketName;
    let OI1 = item1.orderInfo;
    let item5 = obj5[item1Name];
    let OI5 = item5.orderInfo;
    if (OI1["timeSpan"] <= 7 || OI5["timeSpan"] <= 7) {
      //console.log(item1Name);
      let item2 = obj2[item1Name];
      let item3 = obj3[item1Name];
      let item4 = obj4[item1Name];
      let factor4 = Math.round(((item4.Last - item5.Last)/item5.Last)*2000);
      let factor3 = Math.round(((item3.Last - item4.Last)/item4.Last)*2000);
      let factor2 = Math.round(((item2.Last - item3.Last)/item3.Last)*2000);
      let factor1 = Math.round(((item1.Last - item2.Last)/item2.Last)*2000);
      let OI2 = item2.orderInfo;
      let OI3 = item3.orderInfo;
      let OI4 = item4.orderInfo;
      let fluc = Math.round((item1.High/item1.Low)*10);
      newHTML += `<tr><td class="tg-6k2t"><a href="${genTVChart(item1Name)}">${item1Name}</a></td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${200-fluc}, ${200-fluc}, 200)">${fluc}%</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(200, 255, 200)">${item1.High}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(255, 200, 200)">${item1.Low}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${200-fluc}, ${200-fluc}, 200)">${Math.round(((item5.Last - item1.Low)/item1.Low)*100)}%</td>`;
      newHTML += `<td class="tg-6k2t">${item5.Last}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, 175, 205)">${OI5["timeSpan"]}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${200-(item5.redditPosts*2)}, ${100+(item5.redditPosts*2)}, ${255-(item5.redditPosts*2)})">${item5.redditPosts}</td>`;      
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, ${125+OI5["b-s"]*2}, ${125+OI5["b-s"]*2})">${OI5["b-s"]}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${125+factor4}, 255, ${125-factor4})">${factor4}</td>`;
      newHTML += `<td class="tg-6k2t">${item4.Last}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, 175, 205)">${OI4["timeSpan"]}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${200-(item4.redditPosts*2)}, ${100+(item4.redditPosts*2)}, ${255-(item4.redditPosts*2)})">${item4.redditPosts}</td>`;      
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, ${125+OI4["b-s"]*2}, ${125+OI4["b-s"]*2})">${OI4["b-s"]}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${125+factor3}, 255, ${125-factor3})">${factor3}</td>`;
      newHTML += `<td class="tg-6k2t">${item3.Last}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, 175, 205)">${OI3["timeSpan"]}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${200-(item3.redditPosts*2)}, ${100+(item3.redditPosts*2)}, ${255-(item3.redditPosts*2)})">${item3.redditPosts}</td>`;      
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, ${125+OI3["b-s"]*2}, ${125+OI3["b-s"]*2})">${OI3["b-s"]}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${125+factor2}, 255, ${125-factor2})">${factor2}</td>`;
      newHTML += `<td class="tg-6k2t">${item2.Last}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, 175, 205)">${OI2["timeSpan"]}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${200-(item2.redditPosts*2)}, ${100+(item2.redditPosts*2)}, ${255-(item2.redditPosts*2)})">${item2.redditPosts}</td>`;      
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, ${125+OI2["b-s"]*2}, ${125+OI2["b-s"]*2})">${OI2["b-s"]}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${125+factor1}, 255, ${125-factor1})">${factor1}</td>`;
      newHTML += `<td class="tg-6k2t">${item1.Last}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, 175, 205)">${OI1["timeSpan"]}</td>`;
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(${200-(item1.redditPosts*2)}, ${100+(item1.redditPosts*2)}, ${255-(item1.redditPosts*2)})">${item1.redditPosts}</td>`;      
      newHTML += `<td class="tg-6k2t" style="background-color:rgb(205, ${125+OI1["b-s"]*2}, ${125+OI1["b-s"]*2})">${OI1["b-s"]}</td>`;
      newHTML += `<td><a href="${bittrexURL(item1Name)}">View</a></td>`;
          }
     });
    newHTML += `</table></div>`;
    $("#containerDiv").remove();
    $("#tableDiv").append(newHTML);
}