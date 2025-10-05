const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin')
const {isAdmin} = require('../util/auth')
const multer = require('multer');
const {storage,filter} = require('../util/photo')



router.get('/login', adminController.login);
router.post('/login', adminController.login);

router.get('/',isAdmin, adminController.index);
router.post('/',isAdmin, adminController.index);

router.get('/brand',isAdmin, adminController.brand);
router.post('/brand',isAdmin, adminController.brand);
router.patch('/brand',isAdmin, adminController.brand);

router.get('/vehicle',isAdmin, adminController.vehicle);
router.post('/vehicle',isAdmin, adminController.vehicle);
router.patch('/vehicle',isAdmin, adminController.vehicle);

router.get('/place',isAdmin, adminController.place);
router.post('/place',isAdmin, adminController.place);
router.patch('/place',isAdmin, adminController.place);

router.get('/bill',isAdmin, adminController.bill);

router.get('/single/:id',isAdmin, adminController.single);

router.get('/calendar/:id',isAdmin, adminController.calendar);
router.post('/calendar/:id',isAdmin, adminController.calendar);



module.exports = router;
