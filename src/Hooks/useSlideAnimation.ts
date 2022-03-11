import { useEffect, useRef } from 'react';
import {
	Animated,
	Keyboard,
	TextInput,
	useWindowDimensions,
} from 'react-native';

export type UseSlideAnimationFn = (
	categorizing: boolean,
	inputTextRef: React.MutableRefObject<TextInput | undefined>
) => {
	translation: Animated.Value;
};

/**
 * effect to animate sliding number
 */
const useSlideAnimation: UseSlideAnimationFn = (categorizing, inputTextRef) => {
	const { height } = useWindowDimensions();
	const translate = useRef(new Animated.Value(height)).current;

	useEffect(() => {
		if (categorizing) {
			inputTextRef.current?.focus();
			Animated.timing(translate, {
				toValue: 0,
				useNativeDriver: true,
				duration: 250,
			}).start();
		} else {
			Keyboard.dismiss();
			Animated.timing(translate, {
				toValue: height,
				useNativeDriver: true,
				duration: 250,
			}).start();
		}
	}, [categorizing, inputTextRef.current]);
	return { translation: translate };
};

export default useSlideAnimation;
