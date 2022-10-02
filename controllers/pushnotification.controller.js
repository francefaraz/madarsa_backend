const { one_signal } = require("../configs/onesignal.config");
const pushNotificationService = require('../services/pushnotificationservice')
const Notifications = require("../models/notification.model");
console.log(Notifications,"klasjdfklj")

exports.sendNotification = async (req, res, next) => {
  console.log("sendNotification is ",req.body)
  var data = {
    "title": req.body.title,
    "body":req.body.data,
    "date":req.body.date
  }
  
    var message = {
      app_id: one_signal.app_id,
      contents: { tr: "Yeni bildirim", en: data.title+"\n"+data.body+"\n"+data.date },
      included_segments: ["All"],
      content_available: true,
      small_icon: "ic_notification_icon",
      data: {
        PushTitle: "HELLO",
      },
    };
    pushNotificationService.sendPushNotification(message, async(error, result) => {
        if (error)
          return next(error);
        else {
          console.log("notification is",Notifications)
          response = await new Notifications(data).save()
          console.log("response is ",response)
          return res.status(200).send({
            message: "success",
            data: result,
          });
        }
    })
    
}

exports.sendNotificationToDevices = async (req, res, next) => {
  console.log("devices is ",req.body.devices)
  var message = {
    app_id: one_signal.app_id,
    contents: { en: "MADARSA HOLIDAY" },
    included_segments: ["included_player_ids"],
    included_player_ids: req.body.devices,
    content_available: true,
    small_icon: "ic_notification_icon",
    data: {
      PushTitle: "CUSTOM NOTIFICATION",
    },
  };
  pushNotificationService.sendPushNotification(message, (error, result) => {
    if (error) return next(error);
    return res.status(200).send({
      message: "success",
      data: result,
    });
  });
};

exports.getNotifications = async (req, res, next) => {


  Notifications.find()
    .then(result => {
        res.send(result);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving students."
        });
    });
  
}