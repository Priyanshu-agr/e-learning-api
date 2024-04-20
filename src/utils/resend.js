const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (deliverTo, emailSubject, emailText) => {
    await resend.emails.send({
        from: 'Aeonaxy<onboarding@resend.dev>',
        to: deliverTo,
        subject: emailSubject,
        html: `<p>${emailText}</p>`
    });
};

module.exports = sendEmail;