import { fn } from '@firebase.config';
import { useEffect, useState } from 'react';
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
			const res = await fn.httpsCallable('getUserProfile')(uid);
			const profile = res.data as UserProfile;
			isSubscribed && setProfile(profile);
		})();

		return () => {
			isSubscribed = false;
		};
	}, [uid]);

	return { profile };
};

export default useProfile;
