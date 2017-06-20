const express = require('express')
var router = express.Router();
const app = express()

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/testDB');

app.engine('.html', require('ejs').renderFile);

// Make our db accessible to our router
app.use(function(req, res, next){
  req.db = db;
  next();
});

/* GET Userlist page. */
app.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e, docs){}).then( function(info) {
    res.render('testPage.html', {
      bailey: info[0].name,
      tim: info[1].name
    });
  })
});

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/whiteboard.html')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
