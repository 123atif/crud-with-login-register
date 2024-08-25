const nodemailer = require('nodemailer');

//  send mail from my gmail account 
const sendEmail = (user, data, response) => {

    console.log('-------------------->', user.email)

    let config = {
        service: 'gmail',
        auth: {
            user: 'sikandarmiirza@gmail.com',
            pass: 'yhortpsrzknkxnsa'
        }
    }

    let transporter = nodemailer.createTransport(config);

    let message = {
        from: 'sikandarmiirza@gmail.com',
        to: user.email,
        subject: 'Test Email', 
        text: `${data}` 
    }

    transporter.sendMail(message).then(() => {
        return response.status(200).send({ status: true, message: "you should receive a message on your email"});
    }).catch(error => {
        return response.status(400).send({ status: false, message: "Error in Sending Mail"});
    })
}


module.exports = {
    sendEmail
}