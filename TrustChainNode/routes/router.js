var express = require('express');
var app = express();
var router = express.Router();
var User = require('../models/user');
var path = require('path');

var network = require('network');



router.get('/ip', function (req, res, next) {
  network.get_private_ip(function(err, ip) {
    console.log(err || ip); // err may be 'No active network interface found'.
    res.send(ip);
  })
});



// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});




//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// serve static files from template
app.use(express.static(path.join(__dirname + '/../templateLogReg/UserInterface/')));

//app.use(express.static(__dirname + '/../templateLogReg'));

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.sendFile(path.join(__dirname + '/../templateLogReg/UserInterface/index.html'));
          //console.log(path.join(__dirname + '/../templateLogReg/testi.html'));
         // return res.sendFile(path.join(__dirname + '/../templateLogReg/testi.html'));
          //return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
//var url = "mongodb://10.211.48.117:27017";
var kokochain;
var url = "mongodb://projekti2:Bloblo1@ds237669.mlab.com:37669/projekti2";

router.get('/chain1', function (req, res) {
    
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("projekti2");
   
    dbo.collection("chain").find({"_id": new ObjectId("5ac7ecc0f7b74235f8e9dab0")}).toArray(function(err, result) {
        if (err) throw err;
        
       kokochain = result[0];
       res.send(kokochain);
        //console.log(result);
        db.close();
      });
});


    //console.log(res.kokochain);
});



module.exports = router;