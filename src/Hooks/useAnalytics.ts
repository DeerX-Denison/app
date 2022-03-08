import { crash } from '@firebase.config';
import { useEffect } from 'react';
import { UserInfo } from 'types';

const useAnalytics = (userinfo: UserInfo | null | undefined) => {
	useEffect(() => {
		crash.log('App mounted');
		if (userinfo) {
			crash.log('User logged in');
			crash.setUserId(userinfo.uid);
		}
	}, [userinfo]);
};
export default useAnalytics;
