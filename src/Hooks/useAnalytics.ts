import { analytics, crash } from '@firebase.config';
import { useEffect, useState } from 'react';
import { UserInfo } from 'types';

const useAnalytics = (userInfo: UserInfo | null | undefined) => {
	const [userId, setUserId] = useState<string | undefined>(undefined);
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);
		if (userInfo) {
			setUserId(userInfo.uid);
		}
	}, [userInfo]);

	useEffect(() => {
		analytics.logAppOpen();
		crash.log('App mounted');
	}, [mounted]);

	useEffect(() => {
		if (userId) {
			crash.log('User logged in');
			crash.setUserId(userId);
			analytics.setUserId(userId);
			analytics.logLogin({ method: 'sign in email' });
		}
	}, [userId]);
};
export default useAnalytics;
