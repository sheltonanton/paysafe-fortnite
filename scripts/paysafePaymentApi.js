const btoa = require('btoa');
const fetch = require('node-fetch');

const PAYSAFE_API = "https://api.test.paysafe.com/paymenthub/v1";
const PAYSAFE_AUTH = `Basic ${btoa('private-7751:B-qa2-0-5f031cdd-0-302d0214496be84732a01f690268d3b8eb72e5b8ccf94e2202150085913117f2e1a8531505ee8ccfc8e98df3cf1748')}`;

function payByPaysafe(data, callback){
    fetch(`${PAYSAFE_API}/payments`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: PAYSAFE_AUTH
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(json => {
        callback(json, null);
    }).catch(error => {
        callback(null, error);
    });
}

function getCustomerDetails(customerId, callback){
    fetch(`${PAYSAFE_API}/customers/${customerId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: PAYSAFE_AUTH
        }
    }).then(response => response.json()).then(json => {
        callback(json, null);
    }).catch(error => {
        callback(null, error);
    });
}

module.exports.payByPaysafe = payByPaysafe;
module.exports.getCustomerDetails = getCustomerDetails;