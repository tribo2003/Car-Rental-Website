const express = require('express');
const router = express.Router();
const indexController = require('../controller/index')
const {isAuth} = require('../util/auth')


router.get('/', indexController.index);
router.post('/', indexController.index);

router.post('/brand/', indexController.brand)
router.post('/place/', indexController.place)

router.get('/vehicle' ,indexController.vehicle)
router.post('/vehicle' ,indexController.vehicle)

router.get('/single/:id' ,indexController.single)

router.get('/order',isAuth,indexController.order)
router.post('/order',isAuth,indexController.order)

router.get('/profile',isAuth,indexController.profile)

router.post('/comment',indexController.comment)
router.patch('/comment',indexController.comment)

router.post('/feedback',indexController.feedback)


module.exports = router;
