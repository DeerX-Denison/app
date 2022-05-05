import { useEffect } from 'react';
import { ScrollView } from 'react-native';

export type UseScrollToEndOnKeyboard = (
	didShow: boolean,
	scrollViewRef: React.MutableRefObject<ScrollView | undefined>
) => void;

// effect to scroll to latest message when focus on keyboard
const useScrollToEndOnKeyboard: UseScrollToEndOnKeyboard = (
	didShow,
	scrollViewRef
) => {
	useEffect(() => {
		if (didShow) {
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({ animated: true });
			}, 250);
		}
	}, [didShow]);
};

export default useScrollToEndOnKeyboard;
