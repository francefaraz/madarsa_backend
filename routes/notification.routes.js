const express = require("express")
const pushNotificationController = require('../controllers/pushnotification.controller')

const router = express.Router()
router.post("/SendNotification",pushNotificationController.sendNotification)
router.post("/SendNotificationToDevice", pushNotificationController.sendNotificationToDevices);
router.get("/getNotifications",pushNotificationController.getNotifications)
module.exports = router;