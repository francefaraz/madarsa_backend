const { one_signal } = require('../configs/onesignal.config')
const {json}=require('express')
async function sendPushNotification(data, callBack) {
    
    var headers = {
    "accept": "application/json",
    "Authorization": "Basic "+one_signal.app_key,
    "content-type": "application/json"
    }
    var options = {
      host: "onesignal.com",
        path: "/api/v1/notifications",
        port: 443,
        method:"POST",
      headers:headers
    };
    var https = require("https")

    var request = https.request(options, async (response) => {
        response.on("data", function (data) {
            console.log("notification data  is ", JSON.parse(data))

            return callBack(null, JSON.parse(data))
            
        })
        response.on("error", function (e) {
            console.log("error is ", e)
            return callBack({ message: e });
            
        })
        
    });
    console.log(JSON.stringify(data),"data is ",data)
    request.write(JSON.stringify(data));
    request.end();

    

}
module.exports = {
    sendPushNotification
}