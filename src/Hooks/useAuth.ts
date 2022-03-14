import { TIME_TO_RECREATE_USER } from '@Constants';
import { auth, db, fn } from '@firebase.config';
import logger from '@logger';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import { UserInfo } from 'types';

/**
 * utility hook to listen for change on auth state, then set "user" accordingly
 */
const useAuthState = () => {
	const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>();

	// check user login status
	useEffect(() => {
		const subscriber = auth.onAuthStateChanged((user) => {
			setUser(user);
		});
		return subscriber;
	}, []);

	// if logged in, fetch user info from db
	useEffect(() => {
		if (user) {
			(async () => {
				const docSnap = await db.collection('users').doc(user.uid).get();
				const { displayName, photoURL } = docSnap.data() as UserInfo;
				await user.updateProfile({ photoURL, displayName });
			})();
		}
	}, [user]);

	return { user };
};

/**
 * Utility hook to save user info in database if user does not exist. If user exist then do nothing, if fail to save then retry
 */
const useSaveUser = (user: FirebaseAuthTypes.User | null | undefined) => {
	const [userStatus, setUserStatus] = useState<
		'created' | 'existed' | 'updated' | 'error' | undefined
	>();

	/**
	 * Effect to save user in database if user does not exist
	 */
	useEffect(() => {
		let isSubscribe = true;
		if (user) {
			(async () => {
				try {
					const res = await fn.httpsCallable('createUserIfNotExist')();
					if (isSubscribe) {
						if (res.data === 'created') {
							setUserStatus('created');
						} else if (res.data === 'existed') {
							setUserStatus('existed');
						} else if (res.data === 'updated') {
							setUserStatus('updated');
						} else if (res.data === 'error') {
							setUserStatus('error');
						}
					}
				} catch (error) {
					logger.log(error);
					setUserStatus('error');
				}
			})();
		}
		return () => {
			isSubscribe = false;
		};
	}, [user]);

	/**
	 * Effect to call the "create user if not exist" function in interval when the function fail initially.
	 */
	useEffect(() => {
		let interval: NodeJS.Timer;
		let isSubscribe = true;
		if (user && userStatus === 'error') {
			interval = setInterval(async () => {
				try {
					const res = await fn.httpsCallable('createUserIfNotExist')();
					if (isSubscribe) {
						if (res.data === 'created') {
							setUserStatus('created');
						} else if (res.data === 'existed') {
							setUserStatus('existed');
						} else if (res.data === 'updated') {
							setUserStatus('updated');
						} else if (res.data === 'error') {
							setUserStatus('error');
						}
					}
				} catch (error) {
					setUserStatus('error');
				}
			}, TIME_TO_RECREATE_USER);
		}
		return () => {
			isSubscribe = false;
			return clearInterval(interval);
		};
	}, [user, userStatus]);
};

/**
 * Custom hook to handle user authentication
 */
const useAuth = () => {
	const { user } = useAuthState();
	const [userInfo, setUserInfo] = useState<UserInfo | undefined | null>();
	useEffect(() => {
		if (user) {
			setUserInfo({
				email: user.email,
				displayName: user.displayName,
				photoURL: user.photoURL,
				uid: user.uid,
			});
		} else {
			setUserInfo(user);
		}
	}, [user]);

	useSaveUser(user);

	return { user, userInfo };
};

export default useAuth;
