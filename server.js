const express = require('express');
const coinspot = require('coinspot-api');
const app = express();
const mongo = require('mongodb').MongoClient
const dbCollectionUser = "voteruser";
const dbCollectionPolls = "voterpolls";
const secret = process.env.CS_SECRET;
const key = process.env.CS_KEY;
let loggedIn = false;
let offsetDefault = 10;
let database;
let collectUser;
let collectPoll;

//DB functions
mongo.connect('mongodb://gunnja:gunnja@ds131854.mlab.com:31854/fccdb',(err, db) => {
  if (err) throw err
  else console.log("db connection successful")
  collectUser = db.collection(dbCollectionUser);
  collectPoll = db.collection(dbCollectionPolls);
  database = db;
// db.close();
});

function dbInsert(collection,obj) {
  collection.insert(obj, function(err, data) {
    if (err) throw err
    database.close;
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
let client = new coinspot(key, secret);
client.orders('LTC',function(e, data) {
  console.log(data);
  });


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

//app.get("/pollshare", function (req, res) {
//  res.sendfile(__dirname + '/index.html');
//  next();
//});

// Poll Functionality -------
// new poll routing
app.get("/new", function (req, res) {
  let pollName = req.query.name;
  let user = req.query.user;
  exists(collectPoll,{"user":user,"name":pollName}).then(function(bool) {
    if (bool) {
      // already exists
      res.send({'existing': bool });
    } else {
      dbInsert(collectPoll,{"user":user,"name":pollName});
      res.send({'existing': bool });
    }
  });
});

// delete poll routing
app.get("/delpoll", function (req, res) {
  let pollName = req.query.name;
  let user = req.query.user;
  dbDelete(collectPoll,{"user":user,"name":pollName}).then(function(obj) {
    res.send(obj);
  });
});

// get polls
app.get("/existing", function (req, res) {
  if (req.query.user) {
    dbFindAll(collectPoll,{"user": req.query.user}).then(function(obj) {
      console.log(obj);
      res.send(obj);
  });
  } else {
    dbFindAll(collectPoll,{}).then(function(obj) {
      console.log(obj);
      res.send(obj);
  });
  }
});

// retrieve poll
app.get("/poll", function (req, res) {
  //let user = req.query.user;
  let name = req.query.name;
  console.log(name);
  dbFindOne(collectPoll,{"name": name}).then(function(obj) {
    console.log(obj);
    res.send(obj);
  });
});


// add options routing
app.post("/modify", function (req, res) {
  let pollName = req.query.name;
  let option = req.query.option;
  let user = req.query.user;
  dbFindOne(collectPoll,{"name":pollName}).then(function(data) {
    let pollObj = data;
    if (pollObj.options) {
      // options exists
      if (option in pollObj.options) {
        // new option already exists
        res.send({"error": "option already exists"});
      } else {
        // new option doesnt exist
        let options = pollObj.options;
        options[option] = 0;
        let newObj = {"user":user, "name" : pollName, "options" : options};
        console.log("1st",newObj);
        dbUpdate(user,collectPoll,newObj,pollName);
        res.send(newObj);
      }
    } else {
      // options doesnt exist
      let options = {};
      options[option] = 0;
      let newObj = {"user":user, "name" : pollName, "options" : options};
      console.log("2nd",newObj);
      dbUpdate(user,collectPoll,newObj,pollName);
      res.send(newObj);
    }
  })
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});