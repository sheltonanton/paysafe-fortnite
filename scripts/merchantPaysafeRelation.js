let relations = {}

function getCustomerId(merchantId){
    return relations[merchantId];
}

function setCustomerId(merchantId, customerId){
    relations[merchantId] = customerId;
}

function deleteCustomerId(merchantId){
    delete relations[merchantId];
}

module.exports.getCustomerId = getCustomerId;
module.exports.setCustomerId = setCustomerId;
module.exports.deleteCustomerId = deleteCustomerId;