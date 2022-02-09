import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * states of some of the component heights
 */
const useHeights = () => {
	const [inputHeight, setInputHeight] = useState<number>(0);
	const headerHeight = useHeaderHeight();
	const tabsHeight = useBottomTabBarHeight();
	const { height } = useWindowDimensions();

	return {
		inputHeight,
		setInputHeight,
		headerHeight,
		tabsHeight,
		windowHeight: height,
	};
};

export default useHeights;
