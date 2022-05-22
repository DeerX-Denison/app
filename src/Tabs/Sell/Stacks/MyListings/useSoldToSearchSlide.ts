import { useEffect, useRef } from 'react';
import {
	Animated,
	Keyboard,
	TextInput,
	useWindowDimensions,
} from 'react-native';

export type UseSoldToSearchSlide = (
	showingSearch: boolean,
	inputTextRef: React.MutableRefObject<TextInput | undefined>
) => {
	translation: Animated.Value;
};

const useSoldToSearchSlide: UseSoldToSearchSlide = (
	showingSearch,
	inputTextRef
) => {
	const { height } = useWindowDimensions();
	const translate = useRef(new Animated.Value(height)).current;

	useEffect(() => {
		if (showingSearch) {
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
	}, [showingSearch, inputTextRef.current]);
	return { translation: translate };
};

export default useSoldToSearchSlide;
