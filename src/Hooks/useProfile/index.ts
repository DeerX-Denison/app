import { fn } from '@firebase.config';
import logger from '@logger';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { UserProfile } from 'types';

export type UseProfile = (uid: string | undefined) => {
	profile: UserProfile | undefined;
};

const useProfile: UseProfile = (uid) => {
	const [profile, setProfile] = useState<UserProfile | undefined>();

	useEffect(() => {
		if (!uid) return;
		let isSubscribed = true;

		(async () => {
			try {
				const res = await fn.httpsCallable('getUserProfile')(uid);
				const profile = res.data as UserProfile;
				isSubscribed && setProfile(profile);
			} catch (error) {
				logger.error(error);
				Toast.show({
					type: 'error',
					text1: 'Fail To View User Profile',
					text2: 'Please Try Again Later',
				});
			}
		})();

		return () => {
			isSubscribed = false;
		};
	}, [uid]);

	return { profile };
};

export default useProfile;
