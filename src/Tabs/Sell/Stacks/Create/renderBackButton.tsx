import React, { useEffect } from 'react';
import { Button } from 'react-native';
import { Props } from '.';

/**
 * renders button at header that goes back
 */
const renderBackButton = (
	navigation: Props['navigation'],
	categorizing: boolean,
	setCategorizing: React.Dispatch<React.SetStateAction<boolean>>
) => {
	useEffect(() => {
		const parentNavigation = navigation.getParent();
		if (parentNavigation) {
			parentNavigation.setOptions({
				headerLeft: () =>
					categorizing ? (
						<>
							<Button title="back" onPress={() => setCategorizing(false)} />
						</>
					) : (
						<>
							<Button title="back" onPress={() => navigation.goBack()} />
						</>
					),
			});
		}
	});
};
export default renderBackButton;
