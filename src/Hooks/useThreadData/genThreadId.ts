import logger from '@logger';
import { ThreadId, UserInfo } from 'types';

export type GenThreadId = (members: UserInfo[]) => ThreadId;

/**
 * function to generate threadId
 */
const genThreadId: GenThreadId = (members) => {
	if (members.length === 2) {
		const threadId: ThreadId = members
			.map((member) => member.uid)
			.sort()
			.reduce((a, b) => `${a}${b}`);
		return threadId;
	} else {
		logger.error(
			`A thread somehow does not has 2 members: ${JSON.stringify(members)}`
		);
		return '';
	}
};

export default genThreadId;
