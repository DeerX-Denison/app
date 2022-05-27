import { fn } from '@firebase.config';
import logger from '@logger';
import { useEffect, useState } from 'react';
import { UserInfo, UserProfile } from 'types';

/**
 * custom hook to fetch up to date user of the thread for useThreadData
 */
const useMembers = (initMembers: UserInfo[]) => {
	const [members, setMembers] = useState<UserInfo[]>(initMembers);

	useEffect(() => {
		let isSubscribed = true;

		(async () => {
			let members: UserInfo[];
			try {
				members = await Promise.all(
					initMembers.map(async (member) => {
						const res = await fn.httpsCallable('getUserProfile')(member.uid);
						const profile = res.data as UserProfile;
						if (
							'uid' in profile &&
							'displayName' in profile &&
							'photoURL' in profile &&
							'email' in profile
						) {
							const { uid, displayName, photoURL, email } = profile;
							const userInfo: UserInfo = {
								uid,
								displayName,
								photoURL,
								email,
							};
							return userInfo;
						} else {
							throw `Invalid user profile: ${JSON.stringify(profile)}`;
						}
					})
				);
			} catch (error) {
				logger.error(error);
				members = initMembers;
			}
			isSubscribed && setMembers(members);
		})();

		return () => {
			isSubscribed = false;
		};
	}, [initMembers]);

	return { members };
};

export default useMembers;
