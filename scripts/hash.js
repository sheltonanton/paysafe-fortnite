const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();
const hasherOptions = {
    password: "froiim"
}

module.exports = function getHash(text, callback){
    hasher({password: text}, (err, pass, salt, hash) => {
        var string = "";
        for(var i=0; i < hash.length; i++){
            if(hash[i] != '/'){
                string = string + hash[i];
            }else{
                string = string + '-';
            }
        }
        callback(text);
    });
}