import { db } from '@firebase.config';
import { useEffect, useState } from 'react';
import { UserInfo } from 'types';

/**
 * custom hook to fetch up to date user of the thread for useThreadData
 */
const useMembers = (initMembers: UserInfo[]) => {
	const [members, setMembers] = useState<UserInfo[]>(initMembers);

	useEffect(() => {
		let isSubscribed = true;

		(async () => {
			const members = await Promise.all(
				initMembers.map(async (member) => {
					const docSnap = await db.collection('users').doc(member.uid).get();
					if (!docSnap.exists) {
						throw `One of the user is not signed up yet: ${member.uid}`;
					}
					const data = docSnap.data();
					if (!data) {
						throw 'Member data is undefined';
					}

					const userInfo: UserInfo = {
						uid: data.uid,
						displayName: data.displayName,
						photoURL: data.photoURL,
						email: data.email,
					};

					return userInfo;
				})
			);
			isSubscribed && setMembers(members);
		})();

		return () => {
			isSubscribed = false;
		};
	}, []);

	return { members };
};

export default useMembers;
