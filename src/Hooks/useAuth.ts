import { TIME_TO_RECREATE_USER } from '@Constants';
import { auth, db, fn } from '@firebase.config';
import logger from '@logger';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import { UserInfo, UserProfile, UserPronoun } from 'types';

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
				if (docSnap.exists) {
					const { displayName, photoURL } = docSnap.data() as UserInfo;
					await user.updateProfile({ photoURL, displayName });
				}
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
					logger.error(error);
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
					logger.error(error);
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
	const [userProfile, setUserProfile] = useState<
		UserProfile | undefined | null
	>();

	useEffect(() => {
		if (user) {
			const unsubscribe = db
				.collection('users')
				.doc(user.uid)
				.onSnapshot(
					(docSnap) => {
						if (docSnap.exists) {
							const userData = docSnap.data() as UserProfile;
							if (userData) {
								let bio: string | null = null;
								if ('bio' in userData) {
									bio = userData.bio;
								}
								let pronouns: UserPronoun[] | undefined | null = null;
								if ('pronouns' in userData) {
									pronouns = userData.pronouns;
								}
								if (
									'email' in userData &&
									'displayName' in userData &&
									'photoURL' in userData &&
									'uid' in userData
								) {
									setUserProfile({
										email: userData.email,
										displayName: userData.displayName,
										photoURL: userData.photoURL,
										uid: userData.uid,
										bio,
										pronouns,
									});
								}
							}
						} else {
							setUserProfile(null);
						}
					},
					(error) => {
						logger.log(error);
						logger.log(`Error fetching docSnap of uid ${user.uid}`);
					}
				);
			return () => unsubscribe();
		} else {
			setUserProfile(null);
		}
	}, [user]);

	useEffect(() => {
		if (userProfile) {
			setUserInfo({
				email: userProfile.email,
				displayName: userProfile.displayName,
				photoURL: userProfile.photoURL,
				uid: userProfile.uid,
			});
		} else {
			setUserInfo(null);
		}
	}, [userProfile]);
	useSaveUser(user);

	return { user, userInfo, userProfile };
};

export default useAuth;
