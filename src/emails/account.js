const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'merrileespp@hotmail.co.uk',
        subject: 'Thanks for joining',
        text: `Welcome to the task manager app, ${name}.  Let me know how you get along with the app.`
    });
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'merrileespp@hotmail.co.uk',
        subject: 'Sorry your leaving',
        text: `Goodbye, ${name}, hopefully see you again`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}