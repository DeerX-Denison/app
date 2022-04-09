import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import { ListingsStackParamList } from 'types';
import { Messages } from '../Message/Stacks';
import { Item, Listings as ListingsScreen } from './Stacks';
interface Props {}
/**
 * Listing components, part of the 4 tabs of the app
 */
const Listings: FC<Props> = () => {
	const Stack = createNativeStackNavigator<ListingsStackParamList>();
	return (
		<Stack.Navigator initialRouteName="Listings">
			<Stack.Screen name="Listings" initialParams={{ reset: false }}>
				{(props) => <ListingsScreen {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Item"
				options={() => ({
					headerBackTitle: '',
				})}
			>
				{(props) => <Item {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Messages"
				options={{ headerTitle: '', headerBackTitle: '' }}
			>
				{(props) => <Messages {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Listings;
