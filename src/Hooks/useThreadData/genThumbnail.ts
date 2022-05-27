import { DEFAULT_MESSAGE_THUMBNAIL } from '@Constants';
import logger from '@logger';
import { ThreadThumbnail, UserInfo } from 'types';

export type GenThumbnail = (
	selfInfo: UserInfo,
	members: UserInfo[]
) => ThreadThumbnail;

/**
 * function to generate (agregate) thread thumbnail
 */
const genThumbnail: GenThumbnail = (selfInfo, members) => {
	const thumbnail: ThreadThumbnail = {};
	if (members.length === 2) {
		if (members[0].uid === members[1].uid) {
			thumbnail[selfInfo.uid] = selfInfo.photoURL
				? selfInfo.photoURL
				: DEFAULT_MESSAGE_THUMBNAIL;
		} else {
			const otherMember = members.filter(
				(member) => member.uid !== selfInfo.uid
			)[0];
			thumbnail[selfInfo.uid] = otherMember.photoURL
				? otherMember.photoURL
				: DEFAULT_MESSAGE_THUMBNAIL;
			thumbnail[otherMember.uid] = selfInfo.photoURL
				? selfInfo.photoURL
				: DEFAULT_MESSAGE_THUMBNAIL;
		}
	} else {
		logger.error(
			`A thread somehow does not has 2 members: ${JSON.stringify(members)}`
		);
	}
	return thumbnail;
};

export default genThumbnail;
