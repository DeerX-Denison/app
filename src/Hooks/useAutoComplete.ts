import { NEW_THREAD_SUGGESTIONS, PLACEHOLDER_GUEST_EMAIL } from '@Constants';
import { db } from '@firebase.config';
import logger from '@logger';
import { useEffect, useRef, useState } from 'react';
import { UserInfo } from 'types';
import useDebounce from './useDebounce';

/**
 * utility function to fetch suggestion autocomplete based on input query
 */
const queryAutoComplete: (query: string) => Promise<UserInfo[]> = async (
	query
) => {
	try {
		const querySnap = await db
			.collection('users')
			.where('searchableKeyword', 'array-contains', query.trim().toLowerCase())
			.limit(NEW_THREAD_SUGGESTIONS)
			.get();
		return querySnap.docs.map((docSnap) => docSnap.data() as UserInfo);
	} catch (error) {
		logger.error(error);
		return [];
	}
};

/**
 * fetch auto complete suggestion from query (user input)
 */
const useAutoComplete = () => {
	const [query, setQuery] = useState<string>('');
	const [suggestions, setSuggestions] = useState<UserInfo[] | undefined | null>(
		undefined
	);
	const debouncedQueryAutoComplete = useRef(
		useDebounce(queryAutoComplete, 275)
	);
	// fetch suggestion from query
	useEffect(() => {
		let isSubscribed = true;
		if (query.length >= 1) {
			isSubscribed && setSuggestions(null);
			(async () => {
				let userSuggestions = await debouncedQueryAutoComplete.current(query);
				userSuggestions = userSuggestions.filter(
					(x) => x.email !== PLACEHOLDER_GUEST_EMAIL
				);
				isSubscribed && setSuggestions(userSuggestions);
			})();
		} else {
			isSubscribed && setSuggestions(undefined);
		}
		return () => {
			isSubscribed = false;
		};
	}, [query]);
	return { query, setQuery, suggestions, setSuggestions };
};

export default useAutoComplete;
