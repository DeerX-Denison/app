import { NEW_THREAD_SUGGESTIONS } from '@Constants';
import { db } from '@firebase.config';
import { useEffect, useRef, useState } from 'react';
import { UserInfo } from 'types';
import useDebounce from './useDebounce';

/**
 * utility function to fetch suggestion autocomplete based on input query
 */
const queryAutoComplete: (query: string) => Promise<UserInfo[]> = async (
	query
) => {
	const querySnap = await db
		.collection('users')
		.where('searchableKeyword', 'array-contains', query.trim().toLowerCase())
		.limit(NEW_THREAD_SUGGESTIONS)
		.get();
	return querySnap.docs.map((docSnap) => docSnap.data() as UserInfo);
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
				const userSuggestions = await debouncedQueryAutoComplete.current(query);
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
