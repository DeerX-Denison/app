import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export type UseScaleAnimationFn = (opening: boolean) => {
	scale: Animated.Value;
};

/**
 * effect to animate scaling number
 */
const useScaleAnimation: UseScaleAnimationFn = (opening) => {
	const scale = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (opening) {
			Animated.timing(scale, {
				toValue: 0.95,
				useNativeDriver: true,
				duration: 250,
			}).start();
		} else {
			Animated.timing(scale, {
				toValue: 1,
				useNativeDriver: true,
				duration: 250,
			}).start();
		}
	}, [opening]);

	return { scale };
};

export default useScaleAnimation;
