import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import useHeights from './useHeights';
import useKeyboard from './useKeyboard';

/**
 * custom hook to animate padding bottom value of a given animated view when keyboard opens
 */
const useKeyboardPadding = () => {
	const { willShow, keyboardHeight } = useKeyboard();
	const { tabsHeight } = useHeights();

	const paddingBottom = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		console.log(keyboardHeight, tabsHeight);

		if (willShow) {
			Animated.timing(paddingBottom, {
				toValue: keyboardHeight - tabsHeight,
				useNativeDriver: false,
				duration: 250,
			}).start();
		} else {
			Animated.timing(paddingBottom, {
				toValue: 0,
				useNativeDriver: false,
				duration: 250,
			}).start();
		}
	}, [willShow, keyboardHeight, tabsHeight]);
	return { paddingBottom };
};
export default useKeyboardPadding;
