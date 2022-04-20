import React, { useEffect, useRef, useState } from 'react';
import { TextSelection } from 'types';
import useDebounce from './useDebounce';

export type UseSuggestionQuery = (
	inputMessage: string,
	textSelection: TextSelection
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
	const extractQueryDebounced = useRef(useDebounce(extractQuery, 275));
	useEffect(() => {
		let isSubscribed = true;
		(async () => {
			const curQueries = await extractQueryDebounced.current(inputText);
			let count = 0;
			for (let i = 0; i < textSelection.start; i++) {
				if (inputText.charAt(i) === '@') {
					count += 1;
				}
			}
			if (curQueries && curQueries.length > 0) {
				const newQuery = curQueries[count - 1].substring(1);
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
