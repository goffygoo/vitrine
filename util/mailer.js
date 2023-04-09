import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "kulbois007@gmail.com",
        pass: "kypqydqhanzexoyb",
    },
});

const verifyMailSubject = "Verify your Email";
const text = ""

const getVerifyHtml = (token) => {
    return (`
        <h2>Kindly click on the link to verify your email address<h2><br>
        <a href="http://localhost:3000/verify/${token}"><h1>Verify</h1></a><br>
        <p>${token}</p><br>
        <br>
        <h2>Please do NOT reply to this email</h2>
    `)
}

const resetPasswordSubject = "Reset your Password";

const getResetPasswordHtml = (token) => {
    return (`
        <h2>Kindly click on the link to reset your password <h2><br>
        <a href="http://localhost:3000/reset/${token}"><h1>Reset</h1></a><br>
        <p>${token}</p><br>
        <br>
        <h2>Please do NOT reply to this email</h2>
    `)
}

export const sendVerifyMail = async (email, token) => {
    let mailOptions = {
        from: '"Kul Bois" <kulbois007@gmail.com>',
        to: email,
        subject: verifyMailSubject,
        text,
        html: getVerifyHtml(token),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
}

export const sendResetPasswordMail = async (email, token) => {
    let mailOptions = {
        from: '"Kul Bois" <kulbois007@gmail.com>',
        to: email,
        subject: resetPasswordSubject,
        text,
        html: getResetPasswordHtml(token),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
}