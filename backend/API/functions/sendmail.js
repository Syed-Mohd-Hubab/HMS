const nodemailer = require('nodemailer')

module.exports = {
    sendmail: async function (receiver, subject, message) {
        // console.log(process.env.EMAIL)
        // Step 1=
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL || 'example@gmail.com',
                pass: process.env.GMAIL_PASSWORD || '1234'
            }
        });

        // Step 2
        const mailOptions = {
            from: {
                name: 'Health Care Webiste',
                address: 'servicegolang078@gmail.com'
            },
            to: receiver,
            subject: subject,
            html: message
        };

        // Step 3
        let info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }
}