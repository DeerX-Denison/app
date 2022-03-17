import {
	getFocusedRouteNameFromRoute,
	RouteProp,
} from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native';
import { TabsParamList } from 'types';

export type RenderLikedBackButton = (
	route: RouteProp<TabsParamList, 'Liked'>,
	navigation: any
) => React.ReactNode;

const renderLikedBackButton: RenderLikedBackButton = (route, navigation) => {
	const routeName = getFocusedRouteNameFromRoute(route) ?? 'Main';
	switch (routeName) {
		case 'Main':
			return <></>;
		case 'Item':
			return (
				<Button title="back" onPress={() => navigation.navigate('Main')} />
			);
	}
};
export default renderLikedBackButton;
