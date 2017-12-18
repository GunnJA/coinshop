const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const http = require("https");
const secret = process.env.CS_SECRET;
const key = process.env.CS_KEY;
let loggedIn = false;
let offsetDefault = 10;
let database;
let collCoinRoll;
//let collectCoins2;
let dump;
let indexArr = ["a", "b", "c", "d", "e"];
//https://www.reddit.com/search.json?q=xvg&t=hour

//DB functions
let dbProm = new Promise(function(resolve, reject) {
  mongo.connect('mongodb://gunnja:gunnja@ds131854.mlab.com:31854/fccdb',(err, db) => {
      if (err) throw err
      else console.log("db connection successful");
      collCoinRoll = db.collection("coinRoll");
      resolve(collCoinRoll);
  // db.close();
  });
});

function dbInsert(collection,obj) {
  collection.insert(obj, function(err, data) {
    if (err) throw err
    //database.close;
  })
}

function dbUpdate(user,collection,obj,name) {
  let qObj = { "name" : name };
  collection.update(qObj, obj, function(err, data) {
    if (err) throw err
    database.close;
  })
}


function dbFindOne(collection,obj) {
  return new Promise(function(resolve, reject) {
    collection.findOne(obj, function(err, data) {
      if (err) throw err
      else resolve(data);
    })
  })
}

function dbFindAll(collection,obj) {
  return new Promise(function(resolve, reject) {
    collection.find(obj).toArray(function(err,items) {
      if (err) throw err
      resolve(items);
    });
  })
}

function exists(collection, obj) {
  return new Promise(function(resolve, reject) {
    collection.findOne(obj, function(err, item) {
      console.log(item);
      if (err) {
        reject(err);
      } else if (item === null) {
        //doesnt exist
        resolve(false);
      } else {
        //exists
        resolve(true);
      }
    })
  })
}

function dbDelete(collection,obj) {
  return new Promise(function(resolve, reject) {
    collection.deleteOne(obj, function(err, data) {
      if (err) throw err
      else resolve({"delete": true});
    });
  })
}

// bittrex api req
function queryMarket() {
  return new Promise(function(resolve,reject) {
    let result;
    let options = {
      "method": "GET",
      "hostname": "bittrex.com",
      "path": "/api/v1.1/public/getmarketsummaries",
      "port": null
    };

    let req = http.request(options, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        let body = Buffer.concat(chunks);
        resolve(body.toString());
      });
    });
    req.end();
    })
}

// bittrex order api req
function queryOrders(market) {
  return new Promise(function(resolve,reject) {
    let options = {
      "method": "GET",
      "hostname": "bittrex.com",
      "path": `/api/v1.1/public/getmarkethistory?market=${market}`,
      "port": null
    };

    let req = http.request(options, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
       // if chunk.result
        chunks.push(chunk);
      });

      res.on("end", function () {
        let body = Buffer.concat(chunks);
        let newStr = body.toString();
        let newJson = JSON.parse(newStr);
        let obj = evalOrders(market,newJson.result)
        resolve(obj);
      });
    });
    req.end();
    })
}

function evalOrders(market,arr) {
  if (arr[0]) {
    let buys = 0;
    let sells = 0;
    let endTime = new Date(arr[0].TimeStamp);
    let startTime= new Date(arr[arr.length - 1].TimeStamp);
    let timeSpan = Math.ceil((endTime - startTime)/1000/60);
    for (let i = 0; i < arr.length; i += 1) {
      let item = arr[i];
      if (item.FillType === "FILL") {
        if (item.OrderType === "BUY") {
          buys += 1;
        } else {
          sells += 1;
        }
      }
    }
    return { "timeSpan": timeSpan,
             "b-s": buys - sells
           }
  } else  {
    return { "timeSpan": "error",
             "b-s": "error"
           }
  }  
}

function processDump(array,item,collection) {
  return new Promise(function (resolve, reject) {
    let CC1 = [];
    let dump = JSON.parse(array);
    let resultspage1 = dump.result;
    //console.log("resultspage1",resultspage1[1]);
    for (let i=1; i < resultspage1.length; i+= 1) {
      let market = resultspage1[i].MarketName;
      if (market.substring(0, 3) === "BTC") {
        queryOrders(market).then(function(obj) {
          let resultObj = resultspage1[i];
          //let subObj = {};
          resultObj["orderInfo"] = obj;
          console.log("res",resultObj);
          //subObj["MarketName"] = market;
          //subObj["Results"] = resultObj;
          CC1.push(resultObj);
        });
      }
    }
    console.log("cc1",CC1);
    resolve(CC1);
  })
}

dbProm.then(function(collection) {
  //setInterval(recurring, 60000);
  setTimeout(recurring(collection), 1000);
});

function recurring(collection) {
  queryMarket().then(function(array) {
    let item = indexArr.pop();
    console.log("item", item, indexArr)
    processDump(array, item, collection).then(function(obj) {
      let entryObj = {};
      entryObj[item] = obj;
      console.log("CC1",obj);
      dbInsert(collection,entryObj);
      indexArr.unshift(item);
    });
  });
}

app.get("/get/latest", function (req, res) {
  let queryItem = indexArr[0];
  dbFindAll(collCoinRoll, {queryItem}).then(function(obj) {
    res.send(obj);
  });
});

app.get("/get/CC2", function (req, res) {
  let queryItem = indexArr[1];
  dbFindAll(collCoinRoll, {queryItem}).then(function(obj) {
    res.send(obj);
  });
});

app.get("/get/CC3", function (req, res) {
  let queryItem = indexArr[2];
  dbFindAll(collCoinRoll, {queryItem}).then(function(obj) {
    res.send(obj);
  });
});

app.get("/get/CC4", function (req, res) {
  let queryItem = indexArr[3];
  dbFindAll(collCoinRoll, {queryItem}).then(function(obj) {
    res.send(obj);
  });
});

app.get("/get/CC5", function (req, res) {
  let queryItem = indexArr[4];
  dbFindAll(collCoinRoll, {queryItem}).then(function(obj) {
    res.send(obj);
  });
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});