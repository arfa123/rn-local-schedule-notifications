import { NativeModules } from "react-native";
import EventEmitter from "react-native/Libraries/vendor/emitter/EventEmitter";
import { isFunction, isObject } from "./utils";
import AndroidAction from "./AndroidAction";
import AndroidChannel from "./AndroidChannel";
import AndroidChannelGroup from "./AndroidChannelGroup";
import AndroidNotifications from "./AndroidNotifications";
import AndroidRemoteInput from "./AndroidRemoteInput";
import Notification from "./Notification";
import { BadgeIconType, Category, Defaults, GroupAlert, Importance, Priority, SemanticAction, Visibility } from "./types";

const SharedEventEmitter = new EventEmitter();
const { RnLocalScheduleNotifications } = NativeModules;

class Notifications {
	constructor() {
		this._android = new AndroidNotifications(this);
		SharedEventEmitter.addListener( // sub to internal native event - this fans out to
			// public event name: onNotificationDisplayed
			"notifications_notification_displayed", notification => {
				SharedEventEmitter.emit("onNotificationDisplayed", new Notification(notification, this));
			}
		);
		SharedEventEmitter.addListener( // sub to internal native event - this fans out to
			// public event name: onNotificationOpened
			"notifications_notification_opened", notificationOpen => {
				SharedEventEmitter.emit("onNotificationOpened", {
					action: notificationOpen.action,
					notification: new Notification(notificationOpen.notification, this),
					results: notificationOpen.results
				});
			}
		);
		SharedEventEmitter.addListener( // sub to internal native event - this fans out to
			// public event name: onNotification
			"notifications_notification_received", notification => {
				SharedEventEmitter.emit("onNotification", new Notification(notification, this));
		}); // Tell the native module that we"re ready to receive events
	}

	get android() {
		return this._android;
	}

	/**
	 * Cancel all notifications
	 */


	cancelAllNotifications() {
		return RnLocalScheduleNotifications.cancelAllNotifications();
	}
	/**
	 * Cancel a notification by id.
	 * @param notificationId
	 */


	cancelNotification(notificationId) {
		if (!notificationId) {
			return Promise.reject(new Error("Notifications: cancelNotification expects a `notificationId`"));
		}

		return RnLocalScheduleNotifications.cancelNotification(notificationId);
	}
	/**
	 * Display a notification
	 * @param notification
	 * @returns {*}
	 */


	displayNotification(notification) {
		if (!(notification instanceof Notification)) {
			return Promise.reject(new Error(`Notifications:displayNotification expects a "Notification" but got type ${typeof notification}`));
		}

		try {
			return RnLocalScheduleNotifications.displayNotification(notification.build());
		} catch (error) {
			return Promise.reject(error);
		}
	}

	getBadge() {
		return RnLocalScheduleNotifications.getBadge();
	}

	getInitialNotification() {
		return RnLocalScheduleNotifications.getInitialNotification().then(notificationOpen => {
			if (notificationOpen) {
				return {
					action: notificationOpen.action,
					notification: new Notification(notificationOpen.notification, this),
					results: notificationOpen.results
				};
			}

			return null;
		});
	}
	/**
	 * Returns an array of all scheduled notifications
	 * @returns {Promise.<Array>}
	 */


	getScheduledNotifications() {
		return RnLocalScheduleNotifications.getScheduledNotifications();
	}

	onNotification(nextOrObserver) {
		let listener;

		if (isFunction(nextOrObserver)) {
			listener = nextOrObserver;
		} else if (isObject(nextOrObserver) && isFunction(nextOrObserver.next)) {
			listener = nextOrObserver.next;
		} else {
			throw new Error("Notifications.onNotification failed: First argument must be a function or observer object with a `next` function.");
		}

		// getLogger(this).info("Creating onNotification listener");
		SharedEventEmitter.addListener("onNotification", listener);
		return () => {
			//   getLogger(this).info("Removing onNotification listener");
			SharedEventEmitter.removeListener("onNotification", listener);
		};
	}

	onNotificationDisplayed(nextOrObserver) {
		let listener;

		if (isFunction(nextOrObserver)) {
			listener = nextOrObserver;
		} else if (isObject(nextOrObserver) && isFunction(nextOrObserver.next)) {
			listener = nextOrObserver.next;
		} else {
			throw new Error("Notifications.onNotificationDisplayed failed: First argument must be a function or observer object with a `next` function.");
		}

		// getLogger(this).info("Creating onNotificationDisplayed listener");
		SharedEventEmitter.addListener("onNotificationDisplayed", listener);
		return () => {
			//   getLogger(this).info("Removing onNotificationDisplayed listener");
			SharedEventEmitter.removeListener("onNotificationDisplayed", listener);
		};
	}

	onNotificationOpened(nextOrObserver) {
		let listener;

		if (isFunction(nextOrObserver)) {
			listener = nextOrObserver;
		} else if (isObject(nextOrObserver) && isFunction(nextOrObserver.next)) {
			listener = nextOrObserver.next;
		} else {
			throw new Error("Notifications.onNotificationOpened failed: First argument must be a function or observer object with a `next` function.");
		}

		// getLogger(this).info("Creating onNotificationOpened listener");
		SharedEventEmitter.addListener("onNotificationOpened", listener);
		return () => {
			//   getLogger(this).info("Removing onNotificationOpened listener");
			SharedEventEmitter.removeListener("onNotificationOpened", listener);
		};
	}
	/**
	 * Remove all delivered notifications.
	 */


	removeAllDeliveredNotifications() {
		return RnLocalScheduleNotifications.removeAllDeliveredNotifications();
	}
	/**
	 * Remove a delivered notification.
	 * @param notificationId
	 */


	removeDeliveredNotification(notificationId) {
		if (!notificationId) {
			return Promise.reject(new Error("Notifications: removeDeliveredNotification expects a `notificationId`"));
		}

		return RnLocalScheduleNotifications.removeDeliveredNotification(notificationId);
	}
	/**
	 * Schedule a notification
	 * @param notification
	 * @returns {*}
	 */


	scheduleNotification(notification, schedule) {
		if (!(notification instanceof Notification)) {
			return Promise.reject(new Error(`Notifications:scheduleNotification expects a "Notification" but got type ${typeof notification}`));
		}

		try {
			const nativeNotification = notification.build();
			nativeNotification.schedule = schedule;
			return RnLocalScheduleNotifications.scheduleNotification(nativeNotification);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	setBadge(badge) {
		return RnLocalScheduleNotifications.setBadge(badge);
	}

}

export default Notifications;

export const statics = {
	Android: {
		Action: AndroidAction,
		BadgeIconType,
		Category,
		Channel: AndroidChannel,
		ChannelGroup: AndroidChannelGroup,
		Defaults,
		GroupAlert,
		Importance,
		Priority,
		RemoteInput: AndroidRemoteInput,
		SemanticAction,
		Visibility
	},
	Notification
};