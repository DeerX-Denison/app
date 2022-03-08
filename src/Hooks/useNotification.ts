import { msg } from '@firebase.config';
import notifee from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { UserInfo } from 'types';

/**
 * custom hook to activate listenting for notification in foreground (when the app is running) and display them appropriately
 */
const useForegroundNotification = (userInfo: UserInfo | null | undefined) => {
	useEffect(() => {
		if (userInfo) {
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
	}, [userInfo]);
};

/**
 * custom hook to activate listenting for notification in background (when the app is not running) and display then appropriately
 */
const useBackgroundNotification = (userInfo: UserInfo | null | undefined) => {
	if (userInfo) {
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
const useNotification = (userInfo: UserInfo | null | undefined) => {
	useForegroundNotification(userInfo);
	useBackgroundNotification(userInfo);
};

export default useNotification;
