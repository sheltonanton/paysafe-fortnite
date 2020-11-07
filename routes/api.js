var express = require('express');
var router = express.Router();

var usersRouter = require('./api/users');
var sessionsRouter = require('./api/sessions');
var paymentsRouter = require('./api/payments');
/* GET users listing. */
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);
router.use('/payments', paymentsRouter);

module.exports = router;