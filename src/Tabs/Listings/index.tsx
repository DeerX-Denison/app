import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { ListingsStackParamList } from 'types';
import { Item, Listings as ListingsScreen } from './Stacks';

interface Props {}
/**
 * Listing components, part of the 4 tabs of the app
 */
const Listings: FC<Props> = () => {
	const Stack = createNativeStackNavigator<ListingsStackParamList>();
	return (
		<Stack.Navigator
			initialRouteName="Listings"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Listings" initialParams={{ reset: false }}>
				{(props) => <ListingsScreen {...props} />}
			</Stack.Screen>
			<Stack.Screen name="Item">{(props) => <Item {...props} />}</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Listings;
