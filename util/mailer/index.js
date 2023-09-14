import nodemailer from "nodemailer";
import User from "../../model/User.js";
import { getResetPasswordHtml, getSubscriptionEndNotificationHtml, getSubscriptionEndedHtml, getVerifyHtml } from "./emailHtmlBuilder.js";

let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "kulbois007@gmail.com",
		pass: "kypqydqhanzexoyb",
	},
});

const verifyMailSubject = "Verify your Email";
const text = "";

const resetPasswordSubject = "Reset your Password";

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
};

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
};

export const sendMailToUser = async (userId, subject, html) => {
	try {
		const user = await User.findById(userId);
		if (!user) throw Error("User not found");
		let mailOptions = {
			from: '"Kul Bois" <kulbois007@gmail.com>',
			to: user.email,
			subject,
			text,
			html,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("Message sent: %s", info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		});
	} catch (err) {
		console.log(err);
	}
};

export const sendSubscriptionEndedMail = (userId, ...htmlParams) => {
	return sendMailToUser(
		userId,
		"Subscription Ended",
		getSubscriptionEndedHtml(...htmlParams)
	)
}

export const sendSubscriptionEndNotificationMail = (userId, ...htmlParams) => {
	return sendMailToUser(
		userId,
		"Subscription Ending Soon",
		getSubscriptionEndNotificationHtml(...htmlParams)
	)
}