import { FCM_TOKEN_UPDATE_DAY } from '@Constants';
import { fn, msg } from '@firebase.config';
import logger from '@logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { UserInfo } from 'types';
import { v4 as uuidv4 } from 'uuid';

type MessagingStatus =
	| 'not determined'
	| 'denied'
	| 'authorized'
	| 'provisional';

/**
 * custom hook to return permisison status of receiving/displaying notification
 */
const useMessagingStatus = () => {
	const [status, setStatus] = useState<MessagingStatus>('not determined');
	useEffect(() => {
		let isSubscribe = true;
		if (status === 'not determined') {
			(async () => {
				const authStatus = await msg.requestPermission();
				switch (authStatus) {
					case 0:
						isSubscribe && setStatus('denied');
						break;
					case 1:
						isSubscribe && setStatus('authorized');
						break;
					case 2:
						isSubscribe && setStatus('provisional');
						break;
					default:
						isSubscribe && setStatus('not determined');
						break;
				}
			})();
		}
		return () => {
			isSubscribe = false;
		};
	}, [status]);
	return { status };
};

/**
 * funciton to determine if fcm token was last updated more than one week ago
 */
const lastTokenUpdateWasMoreThanOneWeek = async () => {
	let updatedAt: string | null;
	try {
		updatedAt = await AsyncStorage.getItem('fcm_token_time');
		if (!updatedAt) {
			throw logger.error(
				`fcm_token exists in storage but fcm_token_time does not`
			);
		}
	} catch (error) {
		logger.error(`Can't get fcm_token_time from async storage`);
		throw logger.error(error);
	}
	const updatedDate = new Date(parseInt(updatedAt));

	const threadholdUpdatedAt = updatedDate.setUTCDate(
		updatedDate.getUTCDate() + FCM_TOKEN_UPDATE_DAY
	);
	const currentTime = parseInt(Date.now().toString());
	return currentTime > threadholdUpdatedAt;
};

/**
 * custom hook to keep fcm token up to date
 */
const useFCMToken = (userInfo: UserInfo | null | undefined) => {
	const { status } = useMessagingStatus();

	/**
	 * handle token when the user variable changes
	 */
	useEffect(() => {
		if (userInfo) {
			// user just logged in
			if (status === 'authorized' || status === 'provisional') {
				(async () => {
					const deviceId = await AsyncStorage.getItem('deviceId');
					if (!deviceId) {
						// new device, or user just deleted app
						const newDeviceId = uuidv4();
						const newToken = await msg.getToken();
						await AsyncStorage.setItem('uid', userInfo.uid);
						await AsyncStorage.setItem('deviceId', newDeviceId);
						await AsyncStorage.setItem('fcm_token', newToken);
						await AsyncStorage.setItem('fcm_token_time', Date.now().toString());
						await fn.httpsCallable('createFCMToken')({
							deviceId: newDeviceId,
							token: newToken,
						});
					} else {
						// normal device
						if (await lastTokenUpdateWasMoreThanOneWeek()) {
							const newToken = await msg.getToken();
							await AsyncStorage.setItem('fcm_token', newToken);
							await AsyncStorage.setItem(
								'fcm_token_time',
								Date.now().toString()
							);
							await fn.httpsCallable('updateFCMToken')({
								deviceId,
								token: newToken,
							});
						}
					}
				})();
			}
		} else if (userInfo === null) {
			// user just logged out
			(async () => {
				const deviceId = await AsyncStorage.getItem('deviceId');
				const uid = await AsyncStorage.getItem('uid');
				if (deviceId && uid) {
					await fn.httpsCallable('deleteFCMToken')({ deviceId, uid });
				}
				await AsyncStorage.removeItem('uid');
				await AsyncStorage.removeItem('deviceId');
				await AsyncStorage.removeItem('fcm_token');
				await AsyncStorage.removeItem('fcm_token_time');
			})();
		} else {
			// user === undefined, meaning not user is not processed yet
			// do nothing
		}
	}, [userInfo, status]);

	/**
	 * listen for token refreshes
	 */
	useEffect(() => {
		if (userInfo) {
			const unsubscribe = msg.onTokenRefresh(async (newToken) => {
				const deviceId = await AsyncStorage.getItem('deviceId');
				if (!deviceId) {
					// new device, or user just deleted app
					const newDeviceId = uuidv4();
					await AsyncStorage.setItem('uid', userInfo.uid);
					await AsyncStorage.setItem('deviceId', newDeviceId);
					await AsyncStorage.setItem('fcm_token', newToken);
					await AsyncStorage.setItem('fcm_token_time', Date.now().toString());
					await fn.httpsCallable('createFCMToken')({
						deviceId: newDeviceId,
						token: newToken,
					});
				} else {
					// normal device
					await AsyncStorage.setItem('fcm_token', newToken);
					await AsyncStorage.setItem('fcm_token_time', Date.now().toString());
					await fn.httpsCallable('updateFCMToken')({
						deviceId,
						token: newToken,
					});
				}
			});
			return () => unsubscribe();
		}
	}, [userInfo]);
};

export default useFCMToken;
