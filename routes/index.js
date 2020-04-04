var express = require('express');
var router = express.Router();
var ttn_content;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',  });
});

router.post('/ttn', function(req, res, next) {
  // TODO: create parser of POST request coming from TTN
  // TODO: validate info & save it in a database structure
  ttn_content = req.body;
  console.log('Got body:', req.body);
  res.sendStatus(200);
});

module.exports = router;
