var FCM = require("fcm-node");
var serverKey = "AAAAZ3ZrAcE:APA91bFonoDQW__pkxUiPynIyh4cVDRNTCEMYM_PLup_5hDV2KC6exmSeVm1GR1FKr9W8XG8-X8usF8I7tI0EX-ukFoCbvYINBMhLnalth0VBS5NLfHn89qX4o4Xpo2YT5h1URU0GHgl"; //put your server key here
var fcm = new FCM(serverKey);

const pushNotifications = (obj) => {
    console.log(obj)
    var message = {
        to: obj.user_device_token,
        collapse_key: "your_collapse_key",

        notification: {
            title: obj.title,
            body: obj.body,
        },
    };
    console.log("message:", message);
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
};

module.exports = { pushNotifications } 