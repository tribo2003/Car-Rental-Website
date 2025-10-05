const express = require('express');
const router = express.Router();
const usersController = require('../controller/users')

/* GET users listing. */
router.get('/login', usersController.login);
router.post('/login', usersController.login);
router.get('/register', usersController.register);
router.post('/register', usersController.register);
router.get('/logout', usersController.logout);

module.exports = router;
