const express = require('express');
const dotenv = require('dotenv');
const {createDevice, getDeviceById, updateDevice, checkDeviceInUse, updateByDeviceCode} = require('../controllers/deviceController');
const {createAlert} = require('../controllers/alertController');
const router = express.Router();

router.post('/', createDevice);
router.get('/:id', getDeviceById);
router.put('/:id', updateDevice);
router.put('/status/:deviceCode', updateByDeviceCode);
router.get('/:deviceCode/check', checkDeviceInUse);


router.post('/add-alert', createAlert);


module.exports = router;
