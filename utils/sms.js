require('dotenv').config();
var twilio = require('twilio');

class Sms {
    constructor(){
        this.client = new twilio(process.env.TWILIO_ACCOUNT, process.env.TWILIO_TOKEN);
    }

    send(to, body){
        return this.client.messages.create({
                    body,
                    to,
                    from: process.env.TWILIO_NUMBER
                })
                .then((message) => {
                    return 'success';
                })
                .catch(err => {throw err});
    }

    // recipients is a list of phone numbers
    sendBulk(recipients, body) {
        // Filtered out any undefined phone
        recipients = recipients.map(recipient => recipient);
        let promises = recipients.map(recipient => {
            return this.send(recipient, body);
        });

        return Promise.all(promises)
                    .catch(err => { throw err; });
    }
}

module.exports = Sms;
