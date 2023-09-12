import Consumer from "../../model/Consumer.js";
import SubscriptionModel from "../../model/Subscription.js";
import {
	getSubscriptionEndNotificationHtml,
	getSubscriptionEndedHtml,
} from "../../util/emailHtmlBuilder.js";
import { sendMailToUser } from "../../util/mailer.js";
import SpaceModel from "../../model/SpaceModel.js";
import db from "../../util/db.js";

const notifySubscriptionEnding = async () => {
	console.log("hi, please end notifs");
	const week1 = 7 * 24 * 60 * 60 * 1000;
	const day1 = 24 * 60 * 60 * 1000;
	const startTime = Date.now() + week1;
	const endTime = startTime + day1;

	let subscriptions;
	try {
		subscriptions = await SubscriptionModel.find({
			billingDate: {
				$lte: endTime,
				$gte: startTime,
			},
		});
	} catch (err) {
		console.log("Subscription End Notif", err);
	}

	subscriptions?.forEach(async (subscription) => {
		console.log(subscription.consumer.toString());
		await sendMailToUser(
			subscription.consumer,
			"Subscription Ending Soon",
			getSubscriptionEndNotificationHtml(
				subscription.item,
				subscription.consumer
			)
		);
	});
	//
};

const deleteSubscription = async () => {
	const hour1 = 60 * 60 * 1000;
	const endTime = Date.now() + hour1;

	const subscriptions = await SubscriptionModel.find({
		billingDate: {
			$lte: endTime,
		},
	});

	subscriptions.forEach(async (subscription) => {
		try {
			// remove space from consumer
			let session;
			await db
				.startSession()
				.then((_session) => {
					session = _session;
					return session.commitTransaction();
				})
				.then(() => {
					return Consumer.findByIdAndUpdate(subscription.consumer, {
						$pull: { spaces: subscription.item },
					}).session(session);
				})
				.then(() => {
					return SpaceModel.findByIdAndUpdate(subscription.item, {
						$pull: { consumer: subscription.consumer },
					}).session(session);
				})
				.then(() => {
					return SubscriptionModel.findByIdAndDelete(subscription._id).session(
						session
					);
				})
				.then(() => {
					return sendMailToUser(
						subscription.consumer,
						"Subscription Ended",
						getSubscriptionEndedHtml(subscription.item, subscription.consumer)
					);
				})
				.then(() => {
					return session.commitTransaction();
				})
				.catch((err) => {
					console.log(err);
					return session.abortTransaction();
				})
				.finally(() => {
					return session.endSession();
				});
			// remove consumer from space
		} catch (err) {
			console.log("error in subscription workflow", err);
		}
	});
	//
};

const Subscription = {
	notifySubscriptionEnding,
	deleteSubscription,
};

export default Subscription;
