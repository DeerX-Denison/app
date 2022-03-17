import {
	getFocusedRouteNameFromRoute,
	RouteProp,
} from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native';
import { TabsParamList } from 'types';

export type RenderInboxBackButton = (
	route: RouteProp<TabsParamList, 'Inbox'>,
	navigation: any
) => React.ReactNode;

const renderInboxBackButton: RenderInboxBackButton = (route, navigation) => {
	const routeName = getFocusedRouteNameFromRoute(route) ?? 'Threads';
	switch (routeName) {
		case 'Threads':
			return <></>;
		case 'Messages':
			return (
				<Button title="back" onPress={() => navigation.navigate('Threads')} />
			);
	}
};
export default renderInboxBackButton;
