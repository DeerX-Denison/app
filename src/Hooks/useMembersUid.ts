import { useEffect, useState } from 'react';
import { UserInfo } from 'types';

/**
 * custom hook to set membersUid state for useThreadData
 */
const useMembersUid = (
	members: UserInfo[],
	user: UserInfo | undefined | null
) => {
	const [membersUid, setMembersUid] = useState<string[] | undefined>();
	useEffect(() => {
		if (user) setMembersUid(members.map((member) => member.uid));
	}, [user]);
	return { membersUid };
};

export default useMembersUid;
