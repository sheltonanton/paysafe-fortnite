var express = require('express');
var router = express.Router();
const {
  getCustomerDetails, 
  saveCustomerDetails, 
  updateCustomerDetails,
  saveAddressDetails,
  updateAddressDetails
} = require('../../scripts/paysafePaymentApi');
const getHash = require('../../scripts/hash');

/* GET users listing. */
router.get('/id', function(req, res) {
  res.json({merchantCustomerId: getHash(req.session.email || "dummy@dummy.com")});
});

/* GET details about the users */
router.get('/', function(req, res) {
  let {
    name, email, image
  } = req.session;

  if(email != null && email != undefined){
    getCustomerDetails({merchantCustomerId: email}, (response, error) => {
      if(error){
        console.log(error);
        res.status(500).json({error: "INTERNAL SERVER ERROR", message: "Error while fetching customer details"});
        return;
      }
      response = Object.assign(response, {name, merchantCustomerId: email, email, image});
      res.json(response);
    });
  }
});
//get customer detail, the customer id and the whole customer details along with address

/*CREATE A CUSTOMER AND POST IT TO PAYSAFE*/
router.post('/', function(req, res) {
  let data = req.body;
  saveCustomerDetails(data, (response, error) => {
    if(error){
      console.log(error);
      res.status(500).json({error: "INTERNAL SERVER ERROR", message: "Error while saving customer information"});
      return;
    }else{
      res.json(response);
    }
  });
});

/*UPDATE THE CUSTOMER DETAILS TO PAYSAFE*/
router.put('/:id', function(req, res){
  let data = req.body;
  updateCustomerDetails(data, (response, error) => {
    if(error){
      res.status(500).json({error: "INTERNAL SERVER ERROR", message: "Error while saving customer information"});
    }else{
      res.json(response);
    }
  });

  router.post('/:id/addresses', function(req, res){
    let data = req.body;
    let customerId = req.params['id'];
    saveAddressDetails(customerId, data, (response, error) => {
      if(error){
        res.status(500).json({error: "INTERNAL SERVER ERROR", message: "Error while saving customer information"});
      }else{
        res.json(response);
      }
    });
  });

  router.put('/:id/addresses/:addressId', function(req, res){
    let data = req.body;
    let customerId = req.params['id'];
    updateAddressDetails(customerId, data, (response, error) => {
      if(error){
        res.status(500).json({error: "INTERNAL SERVER ERROR", message: "Error while saving customer information"});
      }else{
        res.json(response);
      }
    });
  });

});

module.exports = router;
