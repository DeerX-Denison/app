import { UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import { UserInfo } from 'types';

/**
 * custom hook to set membersUid state for useThreadData
 */
const useMembersUid = (members: UserInfo[]) => {
	const { userInfo } = useContext(UserContext);
	const [membersUid, setMembersUid] = useState<string[] | undefined>();
	useEffect(() => {
		if (userInfo) setMembersUid(members.map((member) => member.uid));
	}, [userInfo, members]);
	return { membersUid };
};

export default useMembersUid;
