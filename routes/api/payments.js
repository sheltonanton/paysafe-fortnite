var express = require('express');
const {payByPaysafe} = require('../../scripts/paysafePaymentApi');
var router = express.Router();
const validator = require('../../validators/payments');
const {getCustomerId, setCustomerId, generateMerchantId} = require('../../scripts/merchantPaysafeRelation');

/* MAKE THE PAYMENT */
router.post('/', function(req, res, next){
    let data = req.body;
    if(data == null){
        res.status(400).json({error: "INVALID_REQUEST", message: "Specify the correct request format"});
        return;
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
    console.log(data);
    if(model == null){
        res.status(400).json({error: "MISSING PARAMETER", message: `Specify the parameter ${key}`});
        return;
    }
    //trigger the paysafe api call from server
    payByPaysafe(model, (response, error) => {
        if(error){
            console.log(error);
            res.status(500).json({error: "PAYMENT FAILED", message: "There is a problem with the server connecting with PaySafe"});
        }else{
            if(response.customerId != null)
                setCustomerId(email, response.customerId); //need to save it in database in future
                req.session.customerId = response.customerId;
            res.json(response);
        }
    });
});

module.exports = router;
