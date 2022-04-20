import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { WishlistStackParamList } from 'types';
import { Item, Profile } from '../Listings/Stacks';
import { Messages } from '../Message/Stacks';
import { Main } from './Stacks';

interface Props {}
/**
 * Wishlist components, part of the 4 tabs of the app
 */
const Wishlist: FC<Props> = () => {
	const Stack = createNativeStackNavigator<WishlistStackParamList>();
	return (
		<Stack.Navigator initialRouteName="Wishlist">
			<Stack.Screen
				name="Wishlist"
				options={{
					headerTitle: 'LIKED ITEMS',
					headerBackTitle: '',
					headerTintColor: 'rgba(199, 32, 47, 1)',
				}}
				initialParams={{ reset: false }}
			>
				{(props) => <Main {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Item"
				options={{
					headerBackTitle: '',
					headerTitle: '',
					headerTintColor: 'rgba(199, 32, 47, 1)',
				}}
			>
				{(props) => <Item {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Profile"
				options={{
					headerBackTitle: '',
					headerTitle: 'PROFILE',
					headerTintColor: 'rgba(199, 32, 47, 1)',
				}}
			>
				{(props) => <Profile {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Messages"
				options={{
					headerTitle: '',
					headerBackTitle: '',
					headerTintColor: 'rgba(199, 32, 47, 1)',
				}}
			>
				{(props) => <Messages {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Wishlist;
