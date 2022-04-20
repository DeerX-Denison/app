import { DENISON_RED_RGBA } from '@Constants';
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
					headerTintColor: DENISON_RED_RGBA,
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
					headerTintColor: DENISON_RED_RGBA,
				}}
			>
				{(props) => <Item {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Profile"
				options={{
					headerBackTitle: '',
					headerTitle: 'PROFILE',
					headerTintColor: DENISON_RED_RGBA,
				}}
			>
				{(props) => <Profile {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Messages"
				options={{
					headerTitle: '',
					headerBackTitle: '',
					headerTintColor: DENISON_RED_RGBA,
				}}
			>
				{(props) => <Messages {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Wishlist;
