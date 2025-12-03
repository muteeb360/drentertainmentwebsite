const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
        service: "gmail", // or outlook / smtp provider
        auth: {
            user: process.env.SMTP_EMAIL,  // stored safely in Netlify
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: data.email,
        to: process.env.SMTP_EMAIL,
        subject: "New Contact Form Message",
        text: `Email: ${data.email}\n\nMessage:\n${data.message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error })
        };
    }
};
