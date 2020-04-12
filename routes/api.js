var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId; 
var assert = require('assert');
require('dotenv').config();
var database_url = "mongodb+srv://"+process.env.MONGODB_USERNAME+":"+process.env.MONGODB_PASSWORD+"@pathpollution-owztr.azure.mongodb.net/test?retryWrites=true&w=majority"

/* GET Point data and colors accordingly */
router.get('/getPointData', function(req, res, next) {
  var req_id = req.query.id;
  mongo.connect(database_url, {useUnifiedTopology: true}, function(err, client) {
    assert.equal(null, err);
    var db = client.db('pollution-app');
    db.collection('sensor-data').findOne({"_id": ObjectId(req_id)}, {projection: {_id:0, co:1, no2:1, pm1:1, pm10:1, pm25:1, humidity: 1, temperature: 1}}, function(err, result) {
      assert.equal(null,err);
      if(result.co <= 300)
        result["color_co"] = "bg-success";
      else if(result.co > 300 && result.co<600)
        result["color_co"] = "bg-warning";
      else if(result.co >= 600 && result.co<1000)
        result["color_co"] = "bg-danger";
      else
        result["color_co"] = "bg-terrible";

      if(result.no2 <= 300)
        result["color_no2"] = "bg-success";
      else if(result.no2 > 300 && result.no2<600)
        result["color_no2"] = "bg-warning";
      else if(result.no2 >= 600 && result.no2<1000)
        result["color_no2"] = "bg-danger";
      else
        result["color_no2"] = "bg-terrible";

      if(result.pm1 <= 20)
        result["color_pm1"] = "bg-success";
      else if(result.pm1 > 20 && result.pm1<30)
        result["color_pm1"] = "bg-warning";
      else if(result.pm1 >= 30 && result.pm1<50)
        result["color_pm1"] = "bg-danger";
      else
        result["color_pm1"] = "bg-terrible";
      
      if(result.pm25 <= 25)
        result["color_pm25"] = "bg-success";
      else if(result.pm25 > 25 && result.pm25<35)
        result["color_pm25"] = "bg-warning";
      else if(result.pm25 >= 35 && result.pm25<55)
        result["color_pm25"] = "bg-danger";
      else
        result["color_pm25"] = "bg-terrible";

      if(result.pm10 <= 30)
        result["color_pm10"] = "bg-success";
      else if(result.pm10 > 30 && result.pm10<40)
        result["color_pm10"] = "bg-warning";
      else if(result.pm10 >= 40 && result.pm10<50)
        result["color_pm10"] = "bg-danger";
      else
        result["color_pm10"] = "bg-terrible";
      
      client.close();
      console.log("Data Point Query Succeded for " + req.query.id);
      res.send(result);
    });
  });
});

module.exports = router;
