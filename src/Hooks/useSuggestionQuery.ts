import React, { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

export type UseSuggestionQuery = (inputMessage: string) => {
	query: string | null;
	setQuery: React.Dispatch<React.SetStateAction<string | null>>;
};

export type ExtractQueryFn = (inputMessage: string) => string | null;
const extractQuery: ExtractQueryFn = (inputMessage) => {
	const matchQuery = inputMessage.match(/@(\S)*/g);
	if (matchQuery && matchQuery.length > 0) {
		return matchQuery[0].substring(1);
	} else {
		return null;
	}
};

/**
 * extract query from input message in a debounced method
 */
const useSuggestionQuery: UseSuggestionQuery = (inputMessage) => {
	const [query, setQuery] = useState<string | null>(null);
	const extractQueryDebounced = useDebounce(extractQuery, 300);
	useEffect(() => {
		let isSubscribed = true;
		(async () => {
			const query = await extractQueryDebounced(inputMessage);
			isSubscribed && setQuery(query);
		})();
		return () => {
			isSubscribed = false;
		};
	}, [inputMessage]);
	return { query, setQuery };
};

export default useSuggestionQuery;
