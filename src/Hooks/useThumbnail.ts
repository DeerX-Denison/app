import { DEFAULT_MESSAGE_THUMBNAIL } from '@Constants';
import { useEffect, useState } from 'react';
import { ThreadThumbnail, UserInfo } from 'types';

/**
 * custom hook to set thumbnail state for useThreadData
 */
const useThumbnail = (
	members: UserInfo[],
	user: UserInfo | undefined | null
) => {
	const [thumbnail, setThumbnail] = useState<ThreadThumbnail | undefined>();
	useEffect(() => {
		if (user) {
			if (members.length === 2) {
				if (members[0].uid === members[1].uid) {
					const thumbnail: ThreadThumbnail = {};
					thumbnail[user.uid] = user.photoURL ? user.photoURL : undefined;
					setThumbnail(thumbnail);
				} else {
					const otherMember = members.filter(
						(member) => member.uid !== user.uid
					)[0];
					const thumbnail: ThreadThumbnail = {};
					thumbnail[user.uid] = otherMember.photoURL
						? otherMember.photoURL
						: DEFAULT_MESSAGE_THUMBNAIL;
					thumbnail[otherMember.uid] = user.photoURL
						? user.photoURL
						: DEFAULT_MESSAGE_THUMBNAIL;
					setThumbnail(thumbnail);
				}
			} else {
				const thumbnail: ThreadThumbnail = {};
				members.forEach(
					(member) =>
						(thumbnail[member.uid] = member.photoURL
							? member.photoURL
							: DEFAULT_MESSAGE_THUMBNAIL)
				);
				setThumbnail(thumbnail);
			}
		}
	}, [members, user]);
	return { thumbnail };
};

export default useThumbnail;
