var express = require('express');
const payByPaysafe = require('../../scripts/paysafePaymentApi');
var router = express.Router();
const paysafePaymentApi = require('../../scripts/paysafePaymentApi');
const validator = require('../../validators/payments');
const {getCustomerId, setCustomerId, generateMerchantId} = require('../../scripts/merchantPaysafeRelation');

/* MAKE THE PAYMENT */
router.post('/', function(req, res, next){
    let data = req.body;
    
    if(data == null){
        res.status(400).json({error: "INVALID_REQUEST", message: "Specify the correct request format"});
    }
    
    //adding some server side values to payload to process the payment
    data.customerIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let email = req.session.email;
    let customerId = getCustomerId(email);
    if(customerId == null || customerId == undefined){
        data.merchantCustomerId = email;
    }else{
        data.customerId = customerId;
    }

    let model = validator(data);

    if(model == null){
        res.status(400).json({error: "MISSING PARAMETER", message: `Specify the parameter ${key}`});
    }

    //trigger the paysafe api call from server
    payByPaysafe(model, (response, error) => {
        if(error){
            res.status(500).json({error: "PAYMENT FAILED", message: "There is a problem with the server connecting with PaySafe"});
        }else{
            if(response.customerId != null)
                setCustomerId(email, response.customerId); //need to save it in database in future
            res.json(response);
        }
    });
});

module.exports = router;
