import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { WishlistStackParamList } from 'types';
import { Item } from '../Listings/Stacks';
import { Main } from './Stacks';

interface Props {}
/**
 * Wishlist components, part of the 4 tabs of the app
 */
const Wishlist: FC<Props> = () => {
	const Stack = createNativeStackNavigator<WishlistStackParamList>();
	return (
		<Stack.Navigator initialRouteName="Wishlist">
			<Stack.Screen name="Wishlist" options={{ headerTitle: 'Liked Items' }}>
				{(props) => <Main {...props} />}
			</Stack.Screen>
			<Stack.Screen name="Item">{(props) => <Item {...props} />}</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Wishlist;
