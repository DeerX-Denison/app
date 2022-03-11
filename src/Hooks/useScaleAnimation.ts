import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export type UseScaleAnimationFn = (categorizing: boolean) => {
	scale: Animated.Value;
};

/**
 * effect to animate scaling number
 */
const useScaleAnimation: UseScaleAnimationFn = (categorizing) => {
	const scale = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (categorizing) {
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
	}, [categorizing]);
	return { scale };
};

export default useScaleAnimation;
