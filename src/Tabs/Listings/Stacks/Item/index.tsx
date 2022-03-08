import * as Buttons from '@Components/Buttons';
import Carousel from '@Components/Carousel';
import { DEFAULT_USER_DISPLAY_NAME, DEFAULT_USER_PHOTO_URL } from '@Constants';
import { UserContext } from '@Contexts';
import { fn } from '@firebase.config';
import { useIsInWishlist, useIsSeller, useListingData } from '@Hooks';
import logger from '@logger';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import Toast from 'react-native-toast-message';
import { ListingsStackParamList, TabsParamList, WishlistDataCL } from 'types';

interface Props {
	route: RouteProp<ListingsStackParamList, 'Item'>;
	navigation: NativeStackNavigationProp<ListingsStackParamList>;
}
/**
 * renders button at header that goes back
 */
const renderBackButton = (navigation: Props['navigation']) => {
	useEffect(() => {
		const parentNavigation = navigation.getParent();
		if (parentNavigation) {
			parentNavigation.setOptions({
				headerLeft: () => (
					<Button title="back" onPress={() => navigation.goBack()} />
				),
			});
		}
	});
};

/**
 * Item components, when user want to view an item in details
 */
const Item: FC<Props> = ({ route, navigation }) => {
	renderBackButton(navigation);
	const { userInfo } = useContext(UserContext);
	const listingId = route.params.listingId;
	const { listingData, setListingData } = useListingData(listingId);
	const { isInWishlist, setIsInWishlist } = useIsInWishlist(listingData?.id);
	const { isSeller } = useIsSeller(listingData);

	/**
	 * effect to check if listingData exists
	 */
	useEffect(() => {
		if (listingData === null) {
			Toast.show({
				type: 'info',
				text1: 'Item does not exist',
			});
			navigation.goBack();
		}
	}, [listingData]);

	const messageHandler = () => {
		if (listingData && userInfo) {
			const parentNav = navigation.getParent<NavigationProp<TabsParamList>>();
			if (parentNav) {
				parentNav.navigate('Inbox', {
					screen: 'Messages',
					params: { members: [userInfo, listingData.seller] },
				});
			} else {
				logger.error(`Parent navigation is undefined for ${listingId}`);
				Toast.show({
					type: 'error',
					text1: 'Unexpected error occured',
				});
			}
		}
	};

	const removeWishlistHandler = async () => {
		if (userInfo && listingData && isInWishlist) {
			try {
				await fn.httpsCallable('deleteWishlist')(listingData.id);
				setIsInWishlist(false);
			} catch (error) {
				logger.log(error);
				Toast.show({
					type: 'error',
					text1: 'Error fetching listing data, please try again later',
				});
			}
		}
	};
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
				await fn.httpsCallable('createWishlist')(wishlistData);
				setIsInWishlist(true);
			} catch (error) {
				logger.log(error);
				Toast.show({
					type: 'error',
					text1: 'Error fetching listing data, please try again later',
				});
			}
		}
	};

	const editHandler = () => {
		const parentNavigation = navigation.getParent();
		if (parentNavigation) {
			parentNavigation.navigate('Sell', {
				screen: 'Edit',
				params: { listingId },
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
						<Carousel
							listingData={listingData}
							setListingData={setListingData}
							editMode={false}
						/>
						<View style={tw('w-full')}>
							<View style={tw('mx-4 my-2')}>
								<View style={tw('flex flex-row justify-between')}>
									<Text style={tw('text-2xl font-bold')}>
										{listingData.name}
									</Text>
									{isSeller && (
										<Buttons.Secondary
											title="edit"
											onPress={editHandler}
											size="md"
										/>
									)}
								</View>
							</View>

							<View style={tw('mx-4 my-2')}>
								<Text style={tw('text-xl font-semibold')}>
									{`$ ${listingData.price.toString()}`}
								</Text>
							</View>

							<View style={tw('mx-4 my-2')}>
								<Text style={tw('text-base font-medium')}>
									Saved by: {listingData.savedBy}
								</Text>
							</View>

							{!isSeller && (
								// if not the seller, render wishlist, buy now, send message button
								<View style={tw('border-t border-b')}>
									<View style={tw('mx-4 my-2')}>
										<View
											style={tw('flex flex-row justify-between items-center')}
										>
											<Button title="send message" onPress={messageHandler} />
											{isInWishlist ? (
												<Button
													title="remove from wishlist"
													onPress={removeWishlistHandler}
												/>
											) : (
												<Button
													title="add to wishlist"
													onPress={addWishlistHandler}
												/>
											)}
										</View>
									</View>
								</View>
							)}

							<View style={tw('mx-4 my-2')}>
								<View style={tw('flex flex-row justify-start items-center')}>
									<Text style={tw('text-base font-medium')}>Seller info:</Text>
									<FastImage
										source={{
											uri: listingData.seller.photoURL
												? listingData.seller.photoURL
												: DEFAULT_USER_PHOTO_URL,
										}}
										style={tw('h-10 w-10 mx-4 rounded-full')}
									/>
									{/* TODO: try to implement fetch displayName from email */}
									<Text style={tw('text-base font-medium')}>
										{listingData.seller.displayName
											? listingData.seller.displayName
											: DEFAULT_USER_DISPLAY_NAME}
									</Text>
								</View>
							</View>

							<View style={tw('mx-4 my-2')}>
								<Text style={tw('text-base font-medium')}>
									Category: {listingData.category}
								</Text>
							</View>

							<View style={tw('mx-4 my-2')}>
								<Text style={tw('text-base font-medium')}>
									Condition: {listingData.condition}
								</Text>
							</View>

							<View style={tw('mx-4 my-2')}>
								<Text style={tw('text-base font-normal')}>
									{listingData.description}
								</Text>
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
