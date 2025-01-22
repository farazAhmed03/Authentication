
const nodeMailer = require('nodemailer');
const sendResponse = require('../Utils/Response');

const mailSender = async(email, title, body) => {
    try {
        let transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }

        });

        let info = await transporter.sendMail({ 
            from: process.env.MAIL_FROM,
            to: `${email}`, 
            subject: `${title}`,
            html: `${body}`
        });

        return info;

    } catch (error) {
        console.log(error.message);
        return sendResponse(res, 500, false, (error.message || "Internal Server Error"));
    }
}


module.exports = mailSender;