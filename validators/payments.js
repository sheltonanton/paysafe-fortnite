const rules = {
    merchantRefNum: "required",
    amount: "required",
    currencyCode: "required",
    dupCheck: "optional",
    settleWithAuth: "optional",
    paymentHandleToken: "required",
    customerIp: "optional",
    description: "optional",
    customerId: "optional",
    merchantCustomerId: "optional"
}

function validator(data){
    let model = {};
    for(var key in rules){
        if(rules[key] === 'required' && data[key] == null){
            return null;
        }
        if(data[key] != null)
            model[key] = data[key];
    }
    return model;
}

module.exports = validator;