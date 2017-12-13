const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient
const http = require("https");
const secret = process.env.CS_SECRET;
const key = process.env.CS_KEY;
let loggedIn = false;
let offsetDefault = 10;
let database;
//let collectCoins1;
//let collectCoins2;
let dump;
let CC1 = [];

//DB functions
let dbProm = new Promise(function(resolve, reject) {
  mongo.connect('mongodb://gunnja:gunnja@ds131854.mlab.com:31854/fccdb',(err, db) => {
      if (err) throw err
      else console.log("db connection successful")
      //collectCoins1 = db.collection("coins1");
      //collectCoins2 = db.collection("coins2");
      database = db;
      resolve();
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
        let newJson = JSON.stringify(newStr);
        console.log(newStr.result);
        resolve(body.toString());
      });
    });
    req.end();
    })
}



function processDump(array,collection) {
  let dump = JSON.parse(array);
  let resultspage1 = dump.result;
  console.log(resultspage1[1].MarketName);
  for (let i=1; i < resultspage1.length; i+= 1) {
    let market = resultspage1[i].MarketName;
    if (market.substring(0, 3) === "BTC") {
      dbInsert(collection,resultspage1[i]);
      CC1.push(resultspage1[i]);
    }
  }
}

function rename(collection) {
  return new Promise(function(resolve,reject) {
    let num = parseInt(collection.substr(12, 1));
    console.log(collection,`collectCoins${num + 1}`);
    let coll = database.collection(collection);
    resolve(coll.rename(`collectCoins${num + 1}`));
  });
}

function dropper(collection) {
  return new Promise(function(resolve,reject) {
    console.log(`drop ${collection}`);
    database.listCollections({"name": collection})
    .next(function(err, collInfo) {
        if (collInfo) {
          resolve(database.collection(collection).drop());
        } else {
          resolve(console.log(`${collection} not found`));          
        }
    });
  });
}

function creator(collection) {
  return new Promise(function(resolve,reject) {
    console.log(`create ${collection}`);
    resolve(database.createCollection(collection));
  });
}

dbProm.then(function() {
  setInterval(recurring, 100000);
  setTimeout(recurring, 1000);
    setTimeout(queryOrders("BTC-RDD"), 1000);
});

function smarts() {
  for (let i=0; i < CC1.length; i+= 1) {
    let market = CC1[i].MarketName;
  }
}

function recurring() {
  CC1 = [];
  dropper("collectCoins5").then(function() {
    rename("collectCoins4").then(function() {
      rename("collectCoins3").then(function() {
        rename("collectCoins2",).then(function() {
          rename("collectCoins1").then(function() {
            creator("collectCoins1").then(function() {
              queryMarket().then(function(array) {
                processDump(array, database.collection("collectCoins1"));
              });
            });
          });
        });
      });
    });
  });
}

app.get("/get/latest", function (req, res) {
  res.send(CC1);
});

app.get("/get/CC2", function (req, res) {
  dbFindAll(database.collection("collectCoins2"),{}).then(function(obj) {
    res.send(obj);
  });
});

app.get("/get/CC3", function (req, res) {
  dbFindAll(database.collection("collectCoins3"),{}).then(function(obj) {
    res.send(obj);
  });
});

app.get("/get/CC4", function (req, res) {
  dbFindAll(database.collection("collectCoins4"),{}).then(function(obj) {
    res.send(obj);
  });
});

app.get("/get/CC5", function (req, res) {
  dbFindAll(database.collection("collectCoins5"),{}).then(function(obj) {
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