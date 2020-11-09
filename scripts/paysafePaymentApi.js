const btoa = require('btoa');
const fetch = require('node-fetch');
const getHash = require('../scripts/hash');
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

function getCustomerDetails(query, callback){
    fetch(`${PAYSAFE_API}/customers?merchantCustomerId=${query.merchantCustomerId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: PAYSAFE_AUTH
        }
    }).then(response => response.json()).then(json => {
        let customer_id = json.id;
        fetch(`${PAYSAFE_API}/customers/${customer_id}?fields=addresses`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: PAYSAFE_AUTH
            }
        }).then(response => response.json()).then(json => {
            let {
                id: customer_id,
                addresses,
                ...remaining
            } = json;
            let {
                id: address_id,
                ...remaddress
            } = addresses && addresses.length > 0 && addresses[0] || {};
            json = {
                ...remaining,
                ...remaddress,
                customer_id,
                address_id
            }
            callback(json, null);
        }).catch(error => {
            callback(null, error);
        })
    }).catch(error => {
        callback(null, error);
    });
}

function saveCustomerDetails(data, callback){
    if(data.email == null){
        callback(null, "Email is not provided");
        return;
    }
    getHash(data.email, (hash) => {
        data.merchantCustomerId = hash;
        fetch(`${PAYSAFE_API}/customers`, {
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
    });
}

function updateCustomerDetails(data, callback){
    if(data.email == null){
        callback(null, "Email is not provided");
        return;
    }
    fetch(`${PAYSAFE_API}/customers/${data.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: PAYSAFE_AUTH
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(json => {
        callback(json, null);
    }).catch(error => {
        callback(null, error);
    })
}

function saveAddressDetails(customer_id, data, callback){
    fetch(`${PAYSAFE_API}/customers/${customer_id}/addresses`, {
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


function updateAddressDetails(customer_id, data, callback){
    fetch(`${PAYSAFE_API}/customers/${customer_id}/addresses/${data.address_id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: PAYSAFE_AUTH
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(json => {
        callback(json, null);
    }).catch(error => {
        callback(null, error);
    })
}
module.exports.payByPaysafe = payByPaysafe;
module.exports.getCustomerDetails = getCustomerDetails;
module.exports.saveCustomerDetails = saveCustomerDetails;
module.exports.updateCustomerDetails = updateCustomerDetails;
module.exports.saveAddressDetails = saveAddressDetails;
module.exports.updateAddressDetails = updateAddressDetails;