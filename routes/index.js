var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/start', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({message: 'success'});
});

router.get("/failed", function(req, res, next){
  res.json({message: "failed"});
});

module.exports = router;
