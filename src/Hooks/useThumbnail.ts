import { DEFAULT_MESSAGE_THUMBNAIL } from '@Constants';
import { UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import { ThreadThumbnail, UserInfo } from 'types';

/**
 * custom hook to set thumbnail state for useThreadData
 */
const useThumbnail = (members: UserInfo[]) => {
	const { userInfo } = useContext(UserContext);
	const [thumbnail, setThumbnail] = useState<ThreadThumbnail | undefined>();
	useEffect(() => {
		if (userInfo) {
			if (members.length === 2) {
				if (members[0].uid === members[1].uid) {
					const thumbnail: ThreadThumbnail = {};
					thumbnail[userInfo.uid] = userInfo.photoURL
						? userInfo.photoURL
						: undefined;
					setThumbnail(thumbnail);
				} else {
					const otherMember = members.filter(
						(member) => member.uid !== userInfo.uid
					)[0];
					const thumbnail: ThreadThumbnail = {};
					thumbnail[userInfo.uid] = otherMember.photoURL
						? otherMember.photoURL
						: DEFAULT_MESSAGE_THUMBNAIL;
					thumbnail[otherMember.uid] = userInfo.photoURL
						? userInfo.photoURL
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
	}, [members, userInfo]);
	return { thumbnail };
};

export default useThumbnail;
