import { msg } from '@firebase.config';
import notifee, { EventType } from '@notifee/react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { HomeTab, InboxTab, SellTab, TabsParamList, UserInfo } from 'types';

/**
 * custom hook to activate listenting for remote messages in foreground (when the app is running) and display them appropriately
 */
const useForegroundMessage = () => {
	useEffect(() => {
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
					data: payload.data,
				});
			}
		);
		return () => unsubscribe();
	}, []);
};

/**
 * custom hook to activate listenting for remote messages in background (when the app is not running) and display then appropriately
 */
const useBackgroundMessage = () => {
	msg.setBackgroundMessageHandler(
		async (payload: FirebaseMessagingTypes.RemoteMessage) => {
			if (payload.data) {
				notifee.displayNotification({
					title: payload.notification?.title,
					body: payload.notification?.body,
					data: payload.data,
				});
			}
		}
	);
};

export type UseForegroundEvent = (
	navigationRef: NavigationContainerRefWithCurrent<TabsParamList>
) => void;
/**
 * setup listener for notification interaction event when app in foreground
 */
const useForegroundEvent: UseForegroundEvent = (navigationRef) => {
	useEffect(() => {
		const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
			switch (type) {
				case EventType.DISMISSED:
					break;
				case EventType.PRESS:
					if (detail.notification) {
						const { data } = detail.notification;
						if (data) {
							if (
								'type' in data &&
								data.type === 'inbox message' &&
								'members' in data
							) {
								const members = JSON.parse(data.members) as UserInfo[];
								if (navigationRef.isReady()) {
									navigationRef.navigate('Inbox', {
										screen: 'Messages',
										params: { members },
										initial: false,
									});
								}
							}
						}
					}
					break;
			}
		});
		return () => unsubscribe();
	}, [navigationRef]);
};
export type UseBackgroundEvent = (
	navigationRef: NavigationContainerRefWithCurrent<TabsParamList>
) => void;

/**
 * setup listener for notification interaction events in background
 */
const useBackgroundEvent: UseBackgroundEvent = (navigationRef) => {
	useEffect(() => {
		// Assume a message-notification contains a "type" property in the data payload of the screen to open
		msg.onNotificationOpenedApp((remoteMessage) => {
			const { data } = remoteMessage;
			if (data) {
				if (
					'type' in data &&
					data.type === 'inbox message' &&
					'members' in data
				) {
					const members = JSON.parse(data.members) as UserInfo[];
					if (navigationRef.isReady()) {
						navigationRef.navigate('Inbox', {
							screen: 'Messages',
							params: { members },
							initial: false,
						});
					}
				}
			}
		});
	}, [navigationRef]);
};

export type UseInitialEvent = () => {
	initialRoute: keyof TabsParamList | null;
	initialParams: HomeTab | InboxTab | SellTab | null | undefined;
};
/**
 * setup listener for notification interaction events when app is not running in background/foreground
 */
const useInitialEvent: UseInitialEvent = () => {
	const [initialRoute, setInitialRoute] = useState<keyof TabsParamList | null>(
		null
	);
	const [initialParams, setInitialParams] = useState<
		TabsParamList[keyof TabsParamList] | undefined | null
	>(null);
	useEffect(() => {
		(async () => {
			// Check whether an initial notification is available
			const remoteMessage = await msg.getInitialNotification();
			if (remoteMessage) {
				const { data } = remoteMessage;
				if (data) {
					if (
						'type' in data &&
						data.type === 'inbox message' &&
						'members' in data
					) {
						const members = JSON.parse(data.members) as UserInfo[];
						setInitialRoute('Inbox');
						setInitialParams({
							screen: 'Messages',
							params: { members },
							initial: false,
						} as InboxTab);
					}
				}
			} else {
				setInitialRoute('Home');
				setInitialParams(undefined);
			}
		})();
	}, []);
	return { initialRoute, initialParams };
};
export type UseNotification = (
	navigationRef: NavigationContainerRefWithCurrent<TabsParamList>
) => {
	initialRoute: keyof TabsParamList | null;
	initialParams: HomeTab | InboxTab | SellTab | undefined | null;
};
/**
 * custom hook to activate listening for notification and display them appropriately
 */
const useNotification: UseNotification = (navigationRef) => {
	useForegroundMessage();
	useBackgroundMessage();
	useForegroundEvent(navigationRef);
	useBackgroundEvent(navigationRef);
	const { initialRoute, initialParams } = useInitialEvent();
	return { initialRoute, initialParams };
};

export default useNotification;
