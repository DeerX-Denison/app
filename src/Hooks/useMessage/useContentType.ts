import { useEffect, useState } from 'react';
import { MessageContentType } from 'types';

export type UseContentTypeFn = (inputText: string) => {
	contentType: MessageContentType[];
};

/**
 * custom hook to parse all content types from input text
 */
const useContentType: UseContentTypeFn = (inputText) => {
	const [contentType, setContentType] = useState<MessageContentType[]>([
		'text',
	]);
	useEffect(() => {
		if (inputText.includes('@')) {
			setContentType([
				...new Set<MessageContentType>([...contentType, 'reference']),
			]);
		} else {
			setContentType(['text']);
		}
	}, [inputText]);
	return { contentType };
};

export default useContentType;
