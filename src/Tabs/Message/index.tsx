import { DENISON_RED_RGBA } from '@Constants';
import { fn } from '@firebase.config';
import { useDebounce } from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React, { FC, useRef } from 'react';
import Toast from 'react-native-toast-message';
import {
	ListingData,
	MessageStackParamList,
	TabsParamList,
	WishlistDataCL,
} from 'types';
import { Item, Profile, Report } from '../Listings/Stacks';
import { Messages, Threads } from './Stacks';
interface Props {
	route: RouteProp<TabsParamList, 'Inbox'>;
}

/**
 * Message components, part of the 4 tabs of the app
 */
const Message: FC<Props> = () => {
	const Stack = createNativeStackNavigator<MessageStackParamList>();
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

	const nullListingDataHandler = (
		navigation: NativeStackNavigationProp<MessageStackParamList, 'Item'>
	) => {
		return () => {
			Toast.show({
				type: 'info',
				text1: 'Item was deleted',
			});
			navigation.goBack();
		};
	};

	return (
		<Stack.Navigator initialRouteName="Threads">
			<Stack.Screen
				name="Threads"
				options={{
					headerTitle: 'INBOX',
					headerBackTitle: '',
					headerTintColor: DENISON_RED_RGBA,
				}}
			>
				{(props) => <Threads {...props} />}
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
				name="Item"
				options={() => ({
					headerBackTitle: '',
					headerTitle: '',
					headerTintColor: DENISON_RED_RGBA,
				})}
			>
				{(props) => (
					<Item
						// eslint-disable-next-line react/prop-types
						nullListingDataHandler={nullListingDataHandler(props.navigation)}
						debouncedAddWishlistToDb={debouncedAddWishlistToDb}
						debouncedRemoveWishlistFromDb={debouncedRemoveWishlistFromDb}
						{...props}
					/>
				)}
			</Stack.Screen>
			<Stack.Screen
				name="Report"
				options={{
					headerTitle: 'REPORT',
					headerBackTitle: '',
					headerTintColor: DENISON_RED_RGBA,
				}}
				initialParams={{ type: undefined, id: undefined }}
			>
				{(props) => <Report {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Message;
