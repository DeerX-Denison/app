import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { ThreadData } from 'types';

export type UseScrollToEndOnOpen = (
	scrollViewRef: React.MutableRefObject<ScrollView | undefined>,
	threadData: ThreadData | undefined
) => void;

const useScrollToEndOnOpen: UseScrollToEndOnOpen = (
	scrollViewRef,
	threadData
) => {
	const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

	useEffect(() => {
		if (scrollViewRef.current && threadData && threadData.messages.length > 0) {
			setIsFirstRender(false);
		}
	}, [scrollViewRef, threadData]);

	useEffect(() => {
		if (isFirstRender === false) {
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({ animated: true });
			}, 0);
		}
	}, [isFirstRender]);
};

export default useScrollToEndOnOpen;
