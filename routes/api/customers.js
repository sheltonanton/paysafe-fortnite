var express = require('express');
var router = express.Router();
const {getCustomerDetails} = require('../../scripts/paysafePaymentApi');

/* GET users listing. */
router.get('/id', function(req, res, next) {
  if(req.session.email == null){
    res.send({merchantId: String(new Date().getTime())});
  }else if(req.session.customerId == null || req.session.customerId == undefined){
    res.send({merchantId: req.session.email});
  }else{
    res.send({customerId: req.session.customerId});
  }
});

/* GET details about the users */
router.get('/', function(req, res, next) {
  let {
    name, email, image
  } = req.session;
  if(req.session.customerId != null && req.session.customerId != undefined){
    getCustomerDetails(req.session.customerId, (response, error) => {
      if(error){
        console.log(error);
        res.status(500).json({error: "INTERNAL SERVER ERROR", message: "Error while fetching customer details"});
        return; 
      }
      response = Object.assign(response, {name, email, image});
      res.json(response);
    });
  }else{
    res.json({name, email, image});
  }
});

/*CREATE A CUSTOMER AND POST IT TO PAYSAFE*/
router.post('/', function(req, res, next) {
  res.send({error: "UNDER DEVELOPMENT", message: "API under development"});
});

module.exports = router;
