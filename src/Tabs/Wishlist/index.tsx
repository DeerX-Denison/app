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
				options={{ headerTitle: 'Liked Items' }}
				initialParams={{ reset: false }}
			>
				{(props) => <Main {...props} />}
			</Stack.Screen>
			<Stack.Screen name="Item" options={{ headerBackTitle: '' }}>
				{(props) => <Item {...props} />}
			</Stack.Screen>
			<Stack.Screen name="Profile" options={{ headerBackTitle: '' }}>
				{(props) => <Profile {...props} />}
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

export default Wishlist;
