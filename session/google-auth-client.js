const {OAuth2Client} = require("google-auth-library");
CLIENT_ID = "584685314295-m141d4bsqmmc15qq9mc7lfbfmrosng8i.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

async function verify(token){
    const ticket = await client.verifyIdToken({
        idToken: token,
        audienceId: CLIENT_ID
    });
    const payload = ticket.getPayload();
    return payload;
}

module.exports = function verityTokenId(token){
    return new Promise(async function(resolve, reject){
        try{
            let payload = verify(token);
            resolve(payload);
        }catch(error){
            reject(error);
        }
    }); 
}