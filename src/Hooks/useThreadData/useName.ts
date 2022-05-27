import { UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import { ThreadName, UserInfo } from 'types';
import genName from './genName';

/**
 * custom hook to set name of new thread for useThreadData
 */
const useName = (members: UserInfo[]) => {
	const { userInfo } = useContext(UserContext);
	const [name, setName] = useState<ThreadName>({});
	useEffect(() => {
		if (userInfo) {
			const name = genName(userInfo, members);
			setName(name);
		} else {
			throw 'User unauthenticated';
		}
	}, [members, userInfo]);
	return { name };
};

export default useName;
