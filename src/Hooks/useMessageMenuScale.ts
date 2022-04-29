import { MESSAGE_MENU_ANIM_TIME } from '@Constants';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export type UseMessageMenuScale = (showingMenuNow: string | undefined) => {
	scale: Animated.Value;
};

/**
 * effect to animate scaling number
 */
const useMessageMenuScale: UseMessageMenuScale = (showingMenuNow) => {
	const scale = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (showingMenuNow) {
			Animated.timing(scale, {
				toValue: 1,
				useNativeDriver: true,
				duration: MESSAGE_MENU_ANIM_TIME,
			}).start();
		} else {
			Animated.timing(scale, {
				toValue: 0,
				useNativeDriver: true,
				duration: MESSAGE_MENU_ANIM_TIME,
			}).start();
		}
	}, [showingMenuNow]);
	return { scale };
};

export default useMessageMenuScale;
