import { DENISON_RED_RGBA } from '@Constants';
import { fn } from '@firebase.config';
import { useDebounce } from '@Hooks';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC, useRef } from 'react';
import { Button } from 'react-native';
import { ListingData, ListingsStackParamList, WishlistDataCL } from 'types';
import { Messages } from '../Message/Stacks';
import { Edit } from '../Sell/Stacks';
import { Item, Listings as ListingsScreen, Profile } from './Stacks';
interface Props {}
/**
 * Listing components, part of the 4 tabs of the app
 */
const Listings: FC<Props> = () => {
	const Stack = createNativeStackNavigator<ListingsStackParamList>();
	const addWishlistToDb = async (wishlistData: WishlistDataCL) => {
		await fn.httpsCallable('createWishlist')(wishlistData);
	};
	const debouncedAddWishlistToDb = useRef(useDebounce(addWishlistToDb, 1000));
	const removeWishlistFromDb = async (listingData: ListingData) => {
		await fn.httpsCallable('deleteWishlist')(listingData.id);
	};
	const debouncedRemoveWishlistFromDb = useRef(
		useDebounce(removeWishlistFromDb, 1000)
	);

	return (
		<Stack.Navigator initialRouteName="Listings">
			<Stack.Screen
				name="Listings"
				initialParams={{ reset: false }}
				options={() => ({
					headerBackTitle: '',
					headerTitle: 'LISTINGS',
					headerTintColor: DENISON_RED_RGBA,
				})}
			>
				{(props) => <ListingsScreen {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Item"
				options={() => ({
					headerBackTitle: '',
					headerTitle: '',
					headerTintColor: DENISON_RED_RGBA,
				})}
			>
				{(props) => (
					<Item
						debouncedAddWishlistToDb={debouncedAddWishlistToDb}
						debouncedRemoveWishlistFromDb={debouncedRemoveWishlistFromDb}
						{...props}
					/>
				)}
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
			<Stack.Screen
				name="Profile"
				options={{
					headerTitle: 'PROFILE',
					headerBackTitle: '',
					headerTintColor: DENISON_RED_RGBA,
				}}
				initialParams={{ uid: undefined }}
			>
				{(props) => <Profile {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Edit"
				options={{
					headerRight: () => (
						<Button
							title="save"
							onPress={() => {
								// do nothing
							}}
						/>
					),
					headerTitle: 'EDIT',
					headerBackTitle: '',
					headerTintColor: DENISON_RED_RGBA,
				}}
			>
				{(props) => <Edit {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Listings;
