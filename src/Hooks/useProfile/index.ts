import { fn } from '@firebase.config';
import logger from '@logger';
import { useEffect, useState } from 'react';
import { UserProfile } from 'types';

export type UseProfile = (uid: string | undefined) => {
	profile: UserProfile | null | undefined;
	setProfile: React.Dispatch<
		React.SetStateAction<UserProfile | null | undefined>
	>;
};

const useProfile: UseProfile = (uid) => {
	const [profile, setProfile] = useState<UserProfile | null | undefined>();

	useEffect(() => {
		if (!uid) return;
		let isSubscribed = true;

		(async () => {
			try {
				const res = await fn.httpsCallable('getUserProfile')(uid);
				const profile = res.data as UserProfile;
				isSubscribed && setProfile(profile);
			} catch (error) {
				isSubscribed && setProfile(null);
				logger.error(error);
			}
		})();

		return () => {
			isSubscribed = false;
		};
	}, [uid]);

	return { profile, setProfile };
};

export default useProfile;
