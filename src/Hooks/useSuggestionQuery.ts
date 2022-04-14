import React, { useEffect, useState } from 'react';
import useDebounce from './useDebounce';
import { TextSelection } from './useMessage/useInputText';

export type UseSuggestionQuery = (
	inputMessage: string,
	textSelection: TextSelection | undefined
) => {
	query: string | null;
	setQuery: React.Dispatch<React.SetStateAction<string | null>>;
};

export type ExtractQueryFn = (inputText: string) => string[] | null;
const extractQuery: ExtractQueryFn = (inputMessage) => {
	const matchQuery = inputMessage.match(/@(\S)*/g);
	if (matchQuery && matchQuery.length > 0) {
		return matchQuery;
	} else {
		return null;
	}
};

/**
 * extract query from input message in a debounced method
 */
const useSuggestionQuery: UseSuggestionQuery = (inputText, textSelection) => {
	const [query, setQuery] = useState<string | null>(null);
	const extractQueryDebounced = useDebounce(extractQuery, 300);
	useEffect(() => {
		let isSubscribed = true;
		(async () => {
			const query = await extractQueryDebounced(inputText);
			let count = 0;
			for (let i = 0; i < textSelection?.start; i++) {
				if (inputText.charAt(i) === '@') {
					count += 1;
				}
			}
			if (query) {
				const newQuery = query[count - 1].substring(1, );
				isSubscribed && setQuery(newQuery);
			}
		})();
		return () => {
			isSubscribed = false;
		};
	}, [inputText]);
	return { query, setQuery };
};

export default useSuggestionQuery;
