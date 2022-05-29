import { UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import { UserInfo } from 'types';
import useThreads from '../useThreads';

export type UseSoldToSearchSuggestion = (query: string) => {
	suggestions: UserInfo[] | undefined | null;
	fetchSuggestion: () => Promise<void>;
	resetSuggestion: () => Promise<void>;
};

// custom hook to query for suggestions when users initiate sold-to process
const useSoldToSearchSuggestion: UseSoldToSearchSuggestion = (query) => {
	const { userInfo: selfInfo } = useContext(UserContext);
	const [suggestions, setSuggestions] = useState<UserInfo[] | undefined | null>(
		undefined
	);
	const { threads, fetchThreads, resetThreads } = useThreads();

	useEffect(() => {
		if (!selfInfo) return;
		if (!threads) return;
		// user info of member used for querying
		const queryMemberInfos = threads
			.map((threadData) => {
				if (threadData.members.length !== 2) {
					return null;
				}
				let queryMemberInfo: UserInfo;
				if (threadData.membersUid[0] === threadData.membersUid[1]) {
					queryMemberInfo = threadData.members[0];
				} else {
					queryMemberInfo = threadData.members.filter(
						(x) => x.uid !== selfInfo.uid
					)[0];
				}
				return queryMemberInfo;
			})
			.filter((x) => x !== null) as UserInfo[];
		const queriedMemberInfos = queryMemberInfos.filter((memberInfo) =>
			memberInfo.displayName?.includes(query)
		);
		setSuggestions(queriedMemberInfos);
	}, [query, selfInfo, threads]);

	return {
		suggestions,
		fetchSuggestion: fetchThreads,
		resetSuggestion: resetThreads,
	};
};

export default useSoldToSearchSuggestion;
