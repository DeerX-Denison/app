import { DEFAULT_MESSAGE_NAME, DEFAULT_SELF_MESSAGE_NAME } from '@Constants';
import logger from '@logger';
import { ThreadName, UserInfo } from 'types';

export type GenName = (selfInfo: UserInfo, members: UserInfo[]) => ThreadName;

/**
 * function to generate (agregate) thread name
 */
const genName: GenName = (selfInfo, members) => {
	const name: ThreadName = {};
	// NOTE: it is implicit that members.length === 2. Cuz we not doing group messaging yet.
	if (members.length == 2) {
		if (members[0].uid === members[1].uid) {
			name[selfInfo.uid] = selfInfo.displayName
				? selfInfo.displayName
				: DEFAULT_SELF_MESSAGE_NAME;
		} else {
			const otherMember = members.filter(
				(member) => member.uid !== selfInfo.uid
			)[0];
			name[selfInfo.uid] = otherMember.displayName
				? otherMember.displayName
				: DEFAULT_MESSAGE_NAME;
			name[otherMember.uid] = selfInfo.displayName
				? selfInfo.displayName
				: DEFAULT_MESSAGE_NAME;
		}
	} else {
		logger.error(
			`A thread somehow does not has 2 members: ${JSON.stringify(members)}`
		);
	}
	return name;
};

export default genName;
