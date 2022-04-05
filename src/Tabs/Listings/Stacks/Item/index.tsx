import * as Badges from '@Components/Badges';
import Carousel from '@Components/Carousel';
import { DEFAULT_USER_DISPLAY_NAME, DEFAULT_USER_PHOTO_URL } from '@Constants';
import { UserContext } from '@Contexts';
import { fn } from '@firebase.config';
import { faEdit, faHeart, faMessage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	useCurrentTime,
	useDebounce,
	useIsInWishlist,
	useIsSeller,
	useItemDisplayTime,
	useListingData,
} from '@Hooks';
import logger from '@logger';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import Toast from 'react-native-toast-message';
import {
	ListingData,
	ListingsStackParamList,
	TabsParamList,
	WishlistDataCL,
} from 'types';

interface Props {
	route: RouteProp<ListingsStackParamList, 'Item'>;
	navigation: NativeStackNavigationProp<ListingsStackParamList, 'Item'>;
}

/**
 * Item components, when user want to view an item in details
 */
const Item: FC<Props> = ({ route, navigation }) => {
	const { userInfo } = useContext(UserContext);
	const listingId = route.params.listingId;
	const { listingData, setListingData } = useListingData(listingId);
	const { isInWishlist, setIsInWishlist } = useIsInWishlist(listingData?.id);
	const { isSeller } = useIsSeller(listingData);
	const { curTime } = useCurrentTime();
	const { displayTime } = useItemDisplayTime(
		listingData?.updatedAt?.toDate(),
		curTime
	);

	/**
	 * effect to check if listingData exists
	 */
	useEffect(() => {
		if (listingData === null) {
			Toast.show({
				type: 'info',
				text1: 'Item was deleted',
			});
			navigation.navigate('Listings', { reset: true });
		}
	}, [listingData]);

	/**
	 * handles when user press message icon
	 */
	const messageHandler = () => {
		if (listingData && userInfo) {
			navigation.navigate('Messages', {
				members: [userInfo, listingData.seller],
			});
		}
	};

	// removed wishlist from db handler
	// ===========================================================================
	const removeWishlistFromDb = async (listingData: ListingData) => {
		await fn.httpsCallable('deleteWishlist')(listingData.id);
	};
	const debouncedRemoveWishlistFromDb = useRef(
		useDebounce(removeWishlistFromDb, 5000)
	);
	const removeWishlistHandler = async () => {
		if (userInfo && listingData && isInWishlist) {
			try {
				setListingData({ ...listingData, savedBy: listingData.savedBy - 1 });
				setIsInWishlist(false);
				if (debouncedRemoveWishlistFromDb)
					await debouncedRemoveWishlistFromDb.current(listingData);
			} catch (error) {
				setIsInWishlist(true);
				logger.log(error);
				Toast.show({
					type: 'error',
					text1: 'Error fetching listing data, please try again later',
				});
			}
		}
	};
	// ===========================================================================

	// add wishlist to db handler
	// ===========================================================================
	const addWishlistToDb = async (wishlistData: WishlistDataCL) => {
		await fn.httpsCallable('createWishlist')(wishlistData);
	};
	const debouncedAddWishlistToDb = useRef(useDebounce(addWishlistToDb, 5000));
	const addWishlistHandler = async () => {
		if (userInfo && listingData && !isInWishlist) {
			try {
				const wishlistData: WishlistDataCL = {
					id: listingData.id,
					thumbnail: listingData.images[0],
					name: listingData.name,
					price: listingData.price,
					seller: listingData.seller,
				};
				setListingData({ ...listingData, savedBy: listingData.savedBy + 1 });
				setIsInWishlist(true);
				if (debouncedAddWishlistToDb.current)
					await debouncedAddWishlistToDb.current(wishlistData);
			} catch (error) {
				setIsInWishlist(false);
				logger.log(error);
				Toast.show({
					type: 'error',
					text1: 'Error fetching listing data, please try again later',
				});
			}
		}
	};
	// ===========================================================================

	const editHandler = () => {
		const parentNavigation =
			navigation.getParent<NavigationProp<TabsParamList>>();
		if (parentNavigation) {
			parentNavigation.navigate('Sell', {
				screen: 'Edit',
				params: { listingId },
				initial: false,
			});
		} else {
			logger.error(`Parent navigation is undefined for ${listingId}`);
			Toast.show({
				type: 'error',
				text1: 'Unexpected error occured',
			});
		}
	};

	return (
		<>
			{listingData ? (
				// listing data fetched, render scroll view with data
				<>
					<ScrollView>
						<View style={tw('mx-4 my-2')}>
							<View style={tw('flex flex-row justify-start items-center')}>
								<FastImage
									source={{
										uri: listingData.seller.photoURL
											? listingData.seller.photoURL
											: DEFAULT_USER_PHOTO_URL,
									}}
									style={tw('h-10 w-10 rounded-full')}
								/>
								{/* TODO: try to implement fetch displayName from email */}
								<Text style={tw('text-base font-medium ml-4')}>
									{listingData.seller.displayName
										? listingData.seller.displayName
										: DEFAULT_USER_DISPLAY_NAME}
								</Text>
							</View>
						</View>
						<Carousel
							listingData={listingData}
							setListingData={setListingData}
							editMode={false}
							listingErrors={undefined}
						/>

						<View style={tw('w-full')}>
							<View style={tw('mx-4 my-1')}>
								<View style={tw('flex flex-1 flex-row')}>
									<View style={tw('mt-2')}>
										{isInWishlist ? (
											<TouchableOpacity onPress={removeWishlistHandler}>
												<FontAwesomeIcon
													icon={faHeart}
													size={24}
													style={tw('text-red-500')}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity onPress={addWishlistHandler}>
												<FontAwesomeIcon
													icon={faHeart}
													size={24}
													style={tw('text-indigo-500')}
												/>
											</TouchableOpacity>
										)}
									</View>
									<View style={tw('ml-4 mt-2')}>
										<TouchableOpacity onPress={messageHandler}>
											<FontAwesomeIcon
												icon={faMessage}
												size={24}
												style={tw('text-indigo-500')}
											/>
										</TouchableOpacity>
									</View>
									<View style={tw('ml-4 mt-2')}>
										{isSeller && (
											<TouchableOpacity onPress={editHandler}>
												<FontAwesomeIcon
													icon={faEdit}
													size={24}
													style={tw('text-indigo-500')}
												/>
											</TouchableOpacity>
										)}
									</View>
								</View>
							</View>
							<View style={tw('mx-4 my-1')}>
								<Text style={tw('text-base font-medium')}>
									{listingData.savedBy} likes
								</Text>
							</View>
							<View style={tw('mx-4 my-1')}>
								<View style={tw('flex flex-row justify-between')}>
									<Text style={tw('text-2xl font-bold')}>
										{listingData.name}
									</Text>
								</View>
								<View style={tw('mt-1')}>
									<Text style={tw('text-lg font-semibold')}>
										{`$ ${listingData.price.toString()}`}
									</Text>
								</View>
							</View>
							<View style={tw('mx-4 my-1')}>
								<Text style={tw('text-base font-normal')}>
									{listingData.description}
								</Text>
							</View>
							<View style={tw('mx-4 my-1 h-8 border-b')}>
								<Text style={tw('text-s-md')}>{displayTime}</Text>
							</View>
							<View style={tw('mx-4 my-2')}>
								<View style={tw('flex flex-row flex-wrap')}>
									<Badges.Primary>
										<Text
											style={tw('capitalize text-s-md font-medium px-2 py-0.5')}
										>
											{listingData.condition?.toLocaleLowerCase()}
										</Text>
									</Badges.Primary>
									{listingData.category.map((category) => (
										<View key={category}>
											<Badges.Light>
												<Text
													style={tw(
														'capitalize text-s-md font-medium px-2 py-0.5'
													)}
												>
													{category}
												</Text>
											</Badges.Light>
										</View>
									))}
								</View>
							</View>
						</View>
					</ScrollView>
				</>
			) : (
				// listing data not fetched, render loading
				<>
					<>
						<View
							style={tw('flex flex-1 justify-center items-center')}
							testID="loading"
						>
							<CircleSnail
								size={80}
								indeterminate={true}
								color={['red', 'green', 'blue']}
							/>
						</View>
					</>
				</>
			)}
		</>
	);
};

export default Item;
