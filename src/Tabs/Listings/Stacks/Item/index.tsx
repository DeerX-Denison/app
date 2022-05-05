import * as Badges from '@Components/Badges';
import Carousel from '@Components/Carousel';
import { DEFAULT_USER_DISPLAY_NAME, DEFAULT_USER_PHOTO_URL } from '@Constants';
import { UserContext } from '@Contexts';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	useCurrentTime,
	useIsInWishlist,
	useIsSeller,
	useItemDisplayTime,
	useListingData,
} from '@Hooks';
import logger from '@logger';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import { ListingData, ListingsStackParamList, WishlistDataCL } from 'types';
import ChatActive from '../../../../static/chat-outline-active.svg';
import Edit from '../../../../static/edit.svg';
import HeartActive from '../../../../static/heart-active.svg';
import HeartInactive from '../../../../static/heart-outline-active.svg';

interface Props {
	route: RouteProp<ListingsStackParamList, 'Item'>;
	navigation: NativeStackNavigationProp<ListingsStackParamList, 'Item'>;
	debouncedAddWishlistToDb: React.MutableRefObject<
		(args: WishlistDataCL) => Promise<Promise<void>>
	>;
	debouncedRemoveWishlistFromDb: React.MutableRefObject<
		(args: ListingData) => Promise<Promise<void>>
	>;
	nullListingDataHandler: () => void;
}

/**
 * Item components, when user want to view an item in details
 */
const Item: FC<Props> = ({
	route,
	navigation,
	debouncedAddWishlistToDb,
	debouncedRemoveWishlistFromDb,
	nullListingDataHandler,
}) => {
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
			nullListingDataHandler();
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

	const removeWishlistHandler = async () => {
		if (userInfo && listingData && isInWishlist) {
			try {
				setListingData({
					...listingData,
					likedBy: listingData.likedBy.filter((x) => x !== userInfo.uid),
				});
				setIsInWishlist(false);
				if (debouncedRemoveWishlistFromDb)
					await debouncedRemoveWishlistFromDb.current(listingData);
			} catch (error) {
				setIsInWishlist(true);
				logger.error(error);
			}
		}
	};
	// ===========================================================================

	// add wishlist to db handler
	// ===========================================================================
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
				setListingData({
					...listingData,
					likedBy: [...listingData.likedBy, userInfo.uid],
				});
				setIsInWishlist(true);
				if (debouncedAddWishlistToDb.current)
					await debouncedAddWishlistToDb.current(wishlistData);
			} catch (error) {
				setIsInWishlist(false);
				logger.error(error);
			}
		}
	};
	// ===========================================================================

	const editHandler = () => {
		navigation.navigate('Edit', { listingId });
	};

	return (
		<>
			{listingData ? (
				// listing data fetched, render scroll view with data
				<>
					<ScrollView>
						<View style={tw('mx-4 my-2 flex-row')}>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate('Profile', {
										uid: listingData.seller.uid,
									})
								}
								style={tw('flex flex-row justify-start items-center flex-1')}
							>
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
							</TouchableOpacity>
							<TouchableOpacity
								style={tw('flex justify-center items-center')}
								onPress={() =>
									navigation.navigate('Report', {
										type: 'listing',
										id: listingData.id,
									})
								}
							>
								<FontAwesomeIcon
									icon={faFlag}
									size={20}
									style={tw('text-denison-red')}
								/>
							</TouchableOpacity>
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
												<HeartActive height={32} width={32} />
											</TouchableOpacity>
										) : (
											<TouchableOpacity onPress={addWishlistHandler}>
												<HeartInactive height={32} width={32} />
											</TouchableOpacity>
										)}
									</View>
									<View style={tw('ml-4 mt-2')}>
										<TouchableOpacity onPress={messageHandler}>
											<ChatActive height={36} width={36} />
										</TouchableOpacity>
									</View>
									<View style={tw('ml-4 mt-2')}>
										{isSeller && (
											<TouchableOpacity onPress={editHandler}>
												<Edit height={32} width={32} />
											</TouchableOpacity>
										)}
									</View>
								</View>
							</View>
							<View style={tw('mx-4 my-1')}>
								<Text style={tw('text-base font-medium')}>
									{listingData.likedBy.length} likes
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
									<Badges.Light>
										<Text
											style={tw(
												'capitalize text-s-md font-semibold px-2 py-0.5 text-white'
											)}
										>
											{listingData.condition?.toLocaleLowerCase()}
										</Text>
									</Badges.Light>
									{listingData.category.map((category) => (
										<View key={category}>
											<Badges.Light>
												<Text
													style={tw(
														'capitalize text-s-md font-semibold px-2 py-0.5 text-gray'
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
