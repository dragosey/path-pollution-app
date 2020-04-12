var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
require('dotenv').config();
var database_url = "mongodb+srv://"+process.env.MONGODB_USERNAME+":"+process.env.MONGODB_PASSWORD+"@pathpollution-owztr.azure.mongodb.net/test?retryWrites=true&w=majority"

function getLatLongLeaflet(callback) {
  var resultArray = new Array();
  mongo.connect(database_url, {useUnifiedTopology: true}, function(err, client) {
    assert.equal(null, err);
    var db = client.db('pollution-app');
    var cursor = db.collection('sensor-data').find().project({_id:1, latitude:1,longitude:1}); 
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      client.close();
      callback(resultArray);
    });
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  getLatLongLeaflet( function(result) {
    var leaflet_points = "";
    result.forEach(function(value) {
      leaflet_points += 'L.marker(['+value.latitude+','+value.longitude+'],{id:\''+value._id+'\'}).addTo(map).on("click", onMarkerClick);';
    });
    res.render('index', { title: 'Express', leaflet_points: leaflet_points });
  });
});

router.post('/ttn', function(req, res, next) {
  var contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0)
    res.sendStatus(400);
  else {
    if(req.body.hardware_serial)
      var hardware_serial = String(req.body.hardware_serial);

    if(req.body.payload_fields) {
      var payload_fields = req.body.payload_fields;
      var co = parseInt(payload_fields.co);
      var hour = parseInt(payload_fields.hour);
      var humidity = parseInt(payload_fields.humidity);
      var latitude = parseFloat(payload_fields.latitude);
      var longitude = parseFloat(payload_fields.longitude);
      var minute = parseInt(payload_fields.minute);
      var no2 = parseInt(payload_fields.no2);
      var pm1 = parseInt(payload_fields.pm1);
      var pm25 = parseInt(payload_fields.pm25);
      var pm10 = parseInt(payload_fields.pm10);
      var second = parseInt(payload_fields.second);
      var temperature = parseInt(payload_fields.temperature);

      // Create element to be inserted into MongoDB
      var element = {
        hardware_id: hardware_serial,
        time: hour+":"+minute+":"+second,
        latitude: latitude,
        longitude: longitude,
        humidity: humidity,
        temperature: temperature,
        co: co,
        no2: no2,
        pm1: pm1,
        pm25: pm25,
        pm10: pm10
      }

      // Connect to MongoDB and Insert Element
      mongo.connect(database_url, {useUnifiedTopology: true}, function(err, client) {
        assert.equal(null, err);
        var db = client.db('pollution-app');
        db.collection('sensor-data').insertOne(element, function(err, result) {
          assert.equal(null, err);
          console.log("Element Inserted");
          client.close();
        });
      });
      res.sendStatus(200);
    } else
      res.sendStatus(400);
  }
});

module.exports = router;
