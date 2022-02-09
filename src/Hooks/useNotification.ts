import { msg } from '@firebase.config';
import notifee from '@notifee/react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { useEffect } from 'react';

/**
 * custom hook to activate listenting for notification in foreground (when the app is running) and display them appropriately
 */
const useForegroundNotification = (
	user: FirebaseAuthTypes.User | null | undefined
) => {
	useEffect(() => {
		if (user) {
			const unsubscribe = msg.onMessage(
				(payload: FirebaseMessagingTypes.RemoteMessage) => {
					notifee.displayNotification({
						title: payload.notification?.title,
						body: payload.notification?.body,
						ios: {
							sound: 'default',
							foregroundPresentationOptions: {
								alert: true,
								badge: true,
								sound: true,
							},
						},
					});
				}
			);
			return () => unsubscribe();
		}
	}, [user]);
};

/**
 * custom hook to activate listenting for notification in background (when the app is not running) and display then appropriately
 */
const useBackgroundNotification = (
	user: FirebaseAuthTypes.User | null | undefined
) => {
	if (user) {
		msg.setBackgroundMessageHandler(
			async (payload: FirebaseMessagingTypes.RemoteMessage) => {
				if (payload.data) {
					notifee.displayNotification({
						title: payload.notification?.title,
						body: payload.notification?.body,
					});
				}
			}
		);
	}
};

/**
 * custom hook to activate listening for notification and display them appropriately
 */
const useNotification = (user: FirebaseAuthTypes.User | null | undefined) => {
	useForegroundNotification(user);
	useBackgroundNotification(user);
};

export default useNotification;
