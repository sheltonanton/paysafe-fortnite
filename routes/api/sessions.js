var express = require('express');
var router = express.Router();
const bkfd2Password = require('pbkdf2-password');
const verifyTokenId = require('../../session/google-auth-client');
const hasher = bkfd2Password();

/* POST create session */
router.post('/', function(req, res, next) {
    let data = req.body;

    //if from google authentication
    if(data['fromGoogle']){
        let {
            name, email, image, token
        } = data;

        //allow the user only after authorization with google
        verifyTokenId(token).then(
            (payload) => {
                req.session = Object.assign(req.session, {name, email, image});
                res.json({
                    name, email, image
                });
            }
        ).catch(
            (error) => {
                res.status(401).json({
                    message: "Authorization failed. Provide a valid google authentication",
                    error: "AUTH_FAILED"
                });
                console.log(error);
            }
        );
    }else{
        let resData = {
            name: "Dummy",
            email: "dummy@dummy.com",
            image: "images/dummy.jpg"
        }
        req.session = Object.assign(req.session, resData);
        res.json(resData);
    }
});

/*DELETE SESSION */
router.delete('/', function(req, res, next){
    req.session.destroy(error => {
        if(error){
            res.status(500).json({
                message: "Cannot log out",
                error: "LOGOUT_FAILED"
            });
        }else{
            console.log(req.cookies);
            if (req.session && req.session.email && req.cookies && req.cookies['fproiim']) {
                res.clearCookie('fproiim');
            }
            res.status(403).send({error: "NOT AUTHORIZED", message: "User is not authorized"});
        }
    });
});

module.exports = router;