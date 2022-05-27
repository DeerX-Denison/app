import { UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import { ThreadThumbnail, UserInfo } from 'types';
import genThumbnail from './genThumbnail';

/**
 * custom hook to set thumbnail state for useThreadData
 */
const useThumbnail = (members: UserInfo[]) => {
	const { userInfo } = useContext(UserContext);
	const [thumbnail, setThumbnail] = useState<ThreadThumbnail | undefined>();
	useEffect(() => {
		if (userInfo) {
			const thumbnail: ThreadThumbnail = genThumbnail(userInfo, members);
			setThumbnail(thumbnail);
		}
	}, [members, userInfo]);
	return { thumbnail };
};

export default useThumbnail;
