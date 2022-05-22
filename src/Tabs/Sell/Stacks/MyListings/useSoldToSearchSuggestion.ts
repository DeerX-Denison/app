import { ThreadsContext, UserContext } from '@Contexts';
import { useContext, useEffect, useState } from 'react';
import { UserInfo } from 'types';

export type UseSoldToSearchSuggestion = (query: string) => {
	suggestions: UserInfo[] | undefined | null;
};

// custom hook to query for suggestions when users initiate sold-to process
const useSoldToSearchSuggestion: UseSoldToSearchSuggestion = (query) => {
	const { userInfo: selfInfo } = useContext(UserContext);
	const [suggestions, setSuggestions] = useState<UserInfo[] | undefined | null>(
		undefined
	);
	const { threadsContext } = useContext(ThreadsContext);
	useEffect(() => {
		if (!selfInfo) return;
		const userInfos = threadsContext
			.map((threadPreviewData) => {
				if (threadPreviewData.members.length !== 2) {
					throw `A thread has member length different than 2: ${threadPreviewData.id}`;
				}
				if (threadPreviewData.members[0] === threadPreviewData.members[1]) {
					return selfInfo;
				}
				return threadPreviewData.members.filter(
					(x) => x.uid !== selfInfo.uid
				)[0];
			})
			.filter((userInfo) => userInfo.displayName?.includes(query));
		setSuggestions(userInfos);
	}, [query, threadsContext]);
	return { suggestions };
};

export default useSoldToSearchSuggestion;
