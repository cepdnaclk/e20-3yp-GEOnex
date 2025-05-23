const express = require('express');
const userAuth = require('../middleware/userAuth.js');
const { getUserData } = require('../controllers/userController.js');
const { addDeviceToUser, getUserDevices, removeDeviceFromUser, getUserBases,getUserClientDevices ,getUserRegisteredDevices, getUserDeviceAlerts} = require('../controllers/userController.js');

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.post('/:userId/add-device',addDeviceToUser);
userRouter.get('/:userId/devices', getUserDevices);
userRouter.get('/:userId/registereddevices', getUserRegisteredDevices);
userRouter.delete('/:userId/remove-device', removeDeviceFromUser);




userRouter.get('/:userId/devices/base-stations', getUserBases);
userRouter.get('/:userId/devices/client-devices', getUserClientDevices);

userRouter.get('/:userId/device-alerts', getUserDeviceAlerts);


module.exports = userRouter;    