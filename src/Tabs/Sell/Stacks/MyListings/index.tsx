import { DENISON_RED_RGBA } from '@Constants';
import { fn } from '@firebase.config';
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useListingError, useMyListings, useScaleAnimation } from '@Hooks';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useEffect, useState } from 'react';
import {
	Animated,
	NativeScrollEvent,
	NativeSyntheticEvent,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import { ListingData, ListingId, SellStackParamList } from 'types';
import SoldToSearch from '../SoldToSearch';
import MyListingMenu from './MyListingMenu';
import useShowingMenu from './useShowingMenu';
import useSoldToSearch from './useSoldToSearch';
interface Props {
	navigation: NativeStackNavigationProp<SellStackParamList, 'MyListing'>;
}

/**
 * MyListing components, a list of all items that is created and put on sale by the user
 */
const MyListings: FC<Props> = ({ navigation }) => {
	const { myListings, resetMyListings, fetchMyListings } = useMyListings();

	const editHandler = (listingId: ListingId) => {
		navigation.navigate('Edit', { listingId });
	};

	const {
		showingSearch,
		setShowingSearch,
		selectedListingData,
		setSelectedListingData,
		selectedSoldTo,
		setSelectedSoldTo,
	} = useSoldToSearch();

	const { setHasEditStatus } = useListingError(selectedListingData);

	/**
	 * effect to run update listing data when user has selected an item
	 * to mark as sold and a user to sell the item to
	 **/
	useEffect(() => {
		if (selectedListingData && selectedSoldTo) {
			const newListingData: ListingData = {
				...selectedListingData,
				status: 'sold',
				soldTo: selectedSoldTo,
			};
			try {
				(async () => {
					await fn.httpsCallable('updateListing')(newListingData);
					setSelectedListingData(undefined);
					setSelectedSoldTo(undefined);
				})();
			} catch (error) {
				logger.error(error);
			}
		}
	}, [selectedListingData, selectedSoldTo]);

	const { showingMenu, toggleMenu, turnOffAllMenu } =
		useShowingMenu(myListings);
	const { scale } = useScaleAnimation(showingSearch);
	// state for refresh control thread preview scroll view
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = async () => {
		setRefreshing(true);
		await resetMyListings();
		setRefreshing(false);
	};

	// when user scroll down to bottom
	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY > 50) {
			fetchMyListings();
		}
	};

	const onScrollBeginDrag = () => {
		turnOffAllMenu();
	};

	return (
		<View style={tw('flex flex-1')}>
			<SoldToSearch
				showingSearch={showingSearch}
				setShowingSearch={setShowingSearch}
				setSelectedSoldTo={setSelectedSoldTo}
				setHasEditStatus={setHasEditStatus}
			/>
			{myListings ? (
				// myListings is fetched, render scroll view
				<Animated.View style={{ ...tw('flex flex-1'), transform: [{ scale }] }}>
					{myListings.length > 0 ? (
						// myListings fetched is not empty, render scroll view
						<>
							<ScrollView
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
										size={24}
									/>
								}
								onScrollEndDrag={onScrollEndDrag}
								onScrollBeginDrag={onScrollBeginDrag}
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={tw(
									'flex-col my-2 mx-2 justify-center items-center'
								)}
							>
								{myListings.map((listing, index) => (
									<View
										key={listing.id}
										style={{
											...tw('w-full mx-1'),
											zIndex: -index,
										}}
									>
										<TouchableWithoutFeedback
											onPress={() => editHandler(listing.id)}
										>
											<View
												style={tw(
													`flex-row justify-between items-center px-2 py-2 bg-white ${
														index !== 0 ? 'border-t border-red-700' : ''
													}`
												)}
											>
												<View
													style={{
														shadowColor: DENISON_RED_RGBA,
														shadowOffset: { width: 2, height: 4 },
														shadowOpacity: 0.25,
														shadowRadius: 4,
													}}
												>
													<FastImage
														source={{ uri: listing.images[0] }}
														style={tw('w-16 h-16 rounded-lg')}
													/>
												</View>
												<View style={tw('flex flex-1 break-words pl-4')}>
													<View style={tw('flex flex-col justify-between')}>
														<Text
															style={tw('text-lg font-bold')}
															ellipsizeMode="tail"
															numberOfLines={1}
														>
															{listing.name}
														</Text>
														<Text
															style={tw('text-sm font-thin')}
															ellipsizeMode="tail"
															numberOfLines={1}
														>
															{(() => {
																switch (listing.status) {
																	case 'posted':
																		return 'public';
																	case 'saved':
																		return 'private';
																	case 'sold':
																		if (
																			'soldTo' in listing &&
																			listing.soldTo &&
																			listing.soldTo.displayName
																		) {
																			return `sold to ${listing.soldTo.displayName}`;
																		}
																		break;
																	default:
																		return '';
																}
															})()}
														</Text>
													</View>
												</View>
												<TouchableOpacity
													onPress={() => toggleMenu(listing.id)}
													style={tw('flex p-4 justify-center items-center')}
												>
													<FontAwesomeIcon
														icon={
															showingMenu[listing.id]
																? faXmarkCircle
																: faEllipsisV
														}
														size={24}
														style={tw('text-denison-red')}
													/>
												</TouchableOpacity>
											</View>
										</TouchableWithoutFeedback>
										<MyListingMenu
											showing={showingMenu[listing.id]}
											listingData={listing}
											editHandler={editHandler}
											showingSearch={showingSearch}
											setShowingSearch={setShowingSearch}
											toggleMenu={toggleMenu}
											setSelectedListingData={setSelectedListingData}
										/>
									</View>
								))}
							</ScrollView>
						</>
					) : (
						// myListings fetched is empty, display empty messages
						<>
							<View
								style={tw('flex flex-col flex-1 justify-center items-center')}
							>
								<Text style={tw('text-s-md font-semibold p-2')}>
									Nothing on sale
								</Text>
								<Text style={tw('text-s-md font-semibold p-2')}>
									Create one by tapping the top right button!
								</Text>
							</View>
						</>
					)}
				</Animated.View>
			) : (
				// myListings not fetched, render loading
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
			)}
		</View>
	);
};

export default MyListings;
