var http = require('http'),
  express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  CollectionDriver = require('./collectionDriver').CollectionDriver;

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

var collectionDriver;

var user = 'todo';
var pass = 'sR6YfVdXkz';
var host = 'ds045632.mongolab.com';
var port = 45632;
var modb = 'heroku_app37689296';
var str  = "mongodb://" + user + ":" + pass + "@" + host + ":" + port + "/" + modb;

MongoClient.connect(str, function(err, mongoClient) {
  if (err) {
    console.error("Error! Exiting... Must start MongoDB first");
    process.exit(1);
  }
  var db = mongoClient.db(modb);
  collectionDriver = new CollectionDriver(db);
});

app.get('/:collection', function(req, res) {
  var params = req.params;
  collectionDriver.findAll(req.params.collection, function(error, objs) {
    if (error) { res.status(400).send(error); }
    else {
      res.set('Content-Type', 'application/json');
      res.status(200).send(objs);
    }
  });
});

app.get('/:collection/:entity', function(req, res) {
  var params = req.params;
  var entity = params.entity;
  if (entity) {
    collectionDriver.get(req.params.collection, entity, function(error, objs) {
      if (error) { res.status(400).send(error); }
      else {
        res.set('Content-Type', 'application/json');
        res.status(200).send(objs);
      }
    });
  } else {
    res.status(400).send({error: 'bad url', url: req.url});
  }
});

app.post('/:collection', function(req, res) {
  var object = req.body;
  var collection = req.params.collection;
  collectionDriver.save(collection, object, function(err, docs) {
    if (err) { res.status(400).send(err); }
    else { res.status(201).send(docs); }
  });
});

app.put('/:collection/:entity', function(req, res) {
  var params = req.params;
  var entity = params.entity;
  var collection = params.collection;
  if (entity) {
    collectionDriver.update(collection, req.body, entity, function(error, objs) {
      if (error) { res.status(400).send(error); }
      else { res.status(400).send(objs); }
    });
  } else {
    var error = { "message": "Cannot PUT a whole collection" };
    res.status(400).send(error);
  }
});

app.delete('/:collection/:entity', function(req, res) {
  var params = req.params;
  var entity = params.entity;
  var collection = params.collection;
  if (entity) {
    collectionDriver.delete(collection, entity, function(error, objs) {
      if (error) { res.status(400).send(error); }
      else { res.status(200).send(objs); }
    });
  } else {
    var error = { "message" : "Cannot DELETE a whole collection" };
    res.status(400).send(error);
  }
});

app.use(function(req,res) {
  res.render('404', { url:req.url });
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
