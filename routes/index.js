var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/start', function(req, res, next) {
  res.json({message: 'success'});
});

router.get("/failed", function(req, res, next){
  res.json({message: "failed"});
});

router.get("/", function(req, res, next){
  res.sendFile('index.html');
});

module.exports = router;