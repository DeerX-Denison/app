import * as Buttons from '@Components/Buttons';
import { fn } from '@firebase.config';
import { useWishlist } from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useEffect, useRef } from 'react';
import {
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
import { SwipeListView } from 'react-native-swipe-list-view';
import { WishlistStackParamList } from 'types';
import Trash from '../../../../static/trash.svg';
interface Props {
	route: RouteProp<WishlistStackParamList, 'Wishlist'>;
	navigation: NativeStackNavigationProp<WishlistStackParamList>;
}

const Main: FC<Props> = ({ route, navigation }) => {
	const { wishlist, setWishlist, fetchWishlist, resetWishlist } =
		useWishlist('');
	const itemHandler = (listingId: string) => {
		navigation.navigate('Item', { listingId });
	};
	const scrollViewRef = useRef<ScrollView | undefined>();

	// when user scroll down to bottom
	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY > 50) {
			fetchWishlist('');
		}
	};
	const deleteHandler = async (id: string) => {
		if (wishlist) {
			setWishlist(wishlist.filter((wl) => wl.id !== id));
			await fn.httpsCallable('deleteWishlist')(id);
		}
	};

	useEffect(() => {
		if (route.params.reset === true) {
			resetWishlist();
		}
	}, [route]);

	// state for refresh control thread preview scroll view
	const [refreshing, setRefreshing] = React.useState(false);
	const onRefresh = async () => {
		setRefreshing(true);
		await resetWishlist();
		setRefreshing(false);
	};

	return (
		<View style={tw('flex flex-1')}>
			{wishlist ? (
				// wishlist is fetched, render scroll view
				<>
					{wishlist.length > 0 ? (
						// wishlist is not empty, render scroll view
						<>
							<SwipeListView
								ref={scrollViewRef as any}
								onScrollEndDrag={onScrollEndDrag}
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
										size={24}
									/>
								}
								data={wishlist}
								renderItem={({ index, item: wishlistData }) => {
									return (
										<TouchableWithoutFeedback
											key={wishlistData.id}
											style={tw('flex-1')}
											onPress={() => itemHandler(wishlistData.id)}
										>
											<View
												style={tw(
													`bg-white flex-row justify-between items-center py-2 ${
														index !== 0 ? 'border-t border-red-700' : ''
													}`
												)}
											>
												<FastImage
													source={{ uri: wishlistData.thumbnail }}
													style={tw('w-16 h-16 rounded-lg mx-2')}
												/>
												<View style={tw('flex flex-1 break-words pl-2')}>
													<Text style={tw('text-lg font-bold')}>
														{wishlistData.name}
													</Text>
												</View>
											</View>
										</TouchableWithoutFeedback>
									);
								}}
								renderHiddenItem={({ item: wishlistData }) => (
									<View style={tw('flex flex-row flex-1 justify-end bg-gray')}>
										<View style={tw('flex flex-row w-16')}>
											<TouchableOpacity
												style={tw('flex flex-1 justify-center items-center')}
												onPress={() => deleteHandler(wishlistData.id)}
											>
												<Trash height={48} width={48} />
											</TouchableOpacity>
										</View>
									</View>
								)}
								rightOpenValue={-64}
								disableRightSwipe={true}
								swipeToOpenPercent={10}
								contentContainerStyle={tw(
									'flex flex-col flex-1 my-2 justify-start'
								)}
							/>
						</>
					) : (
						// wishlist is empty, display empty message
						<>
							<View
								style={tw('flex flex-col flex-1 justify-center items-center')}
							>
								<Text style={tw('text-s-md font-semibold p-4')}>
									Like something? Add then here!
								</Text>
								<Buttons.Primary
									size="md"
									title="Find something"
									onPress={() => {
										const parentNavigation = navigation.getParent();
										if (parentNavigation) {
											parentNavigation.navigate('Home');
										}
									}}
								/>
							</View>
						</>
					)}
				</>
			) : (
				// wishlist not fetched, render loading
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

export default Main;
