var express = require('express');
var router = express.Router();

var usersRouter = require('./api/users');
var sessionsRouter = require('./api/sessions');

/* GET users listing. */
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);

module.exports = router;
