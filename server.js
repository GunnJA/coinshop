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
      console.log(items);
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
    })
  })
}

// CS API
app.get("https://bittrex.com/api/v1.1/public/getmarkets", function (req, res) {
  console.log(res);
});

// yelp api req
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

function processDump(array,collection) {
  let dump = JSON.parse(array);
  let resultspage1 = dump.result;
  console.log(resultspage1[1].MarketName);
  for (let i=1; i < resultspage1.length; i+= 1) {
    let market = resultspage1[i].MarketName;
    if (market.substring(0, 3) === "BTC") {
      dbInsert(collection,resultspage1[i]);
    }
  }
}

function dbOrg(collection,del) {
  return new Promise(function(resolve,reject) {
    let num = parseInt(collection.substr(12, 1));
    console.log("num",num + 1,typeof(num));
    let coll = database.collection(collection);
    resolve(coll.rename(`collectCoins${num + 1}`,del));
  });
}

dbProm.then(function() {
  setInterval(recurring, 300000);
});

function recurring() {
  database.collection("collectCoins5").drop();
  dbOrg("collectCoins4",true).then(function() {
    dbOrg("collectCoins3",false).then(function() {
      dbOrg("collectCoins2",false).then(function() {
        dbOrg("collectCoins1",false).then(function() {
          database.createCollection("collectCoins1");
          queryMarket().then(function(array) {
            processDump(array, database.collection("collectCoins1"));
          });
        });
      });
    });
  });
}
  

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});