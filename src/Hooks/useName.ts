import { DEFAULT_MESSAGE_NAME, DEFAULT_SELF_MESSAGE_NAME } from '@Constants';
import { UserContext } from '@Contexts';
import logger from '@logger';
import { useContext, useEffect, useState } from 'react';
import { ThreadName, UserInfo } from 'types';

/**
 * custom hook to set name of new thread for useThreadData
 */
const useName = (members: UserInfo[]) => {
	const { userInfo } = useContext(UserContext);
	const [name, setName] = useState<ThreadName>({});
	useEffect(() => {
		if (userInfo) {
			// NOTE: it is implicit that members.length === 2. Cuz we not doing group messaging yet.
			if (members.length == 2) {
				if (members[0].uid === members[1].uid) {
					const name: ThreadName = {};
					name[userInfo.uid] = userInfo.displayName
						? userInfo.displayName
						: 'Message to self';
					setName(name);
				} else {
					const otherMember = members.filter(
						(member) => member.uid !== userInfo.uid
					)[0];
					const name: ThreadName = {};
					name[userInfo.uid] = otherMember.displayName
						? otherMember.displayName
						: DEFAULT_SELF_MESSAGE_NAME;
					name[otherMember.uid] = userInfo.displayName
						? userInfo.displayName
						: DEFAULT_MESSAGE_NAME;

					setName(name);
				}
			} else {
				const name: ThreadName = {};
				members.forEach((member) => {
					name[member.uid] = DEFAULT_MESSAGE_NAME;
				});
				setName(name);
				logger.error('A thread somehow does not has 2 members');
			}
		} else {
			throw 'User unauthenticated';
		}
	}, [members, userInfo]);
	return { name };
};

export default useName;
