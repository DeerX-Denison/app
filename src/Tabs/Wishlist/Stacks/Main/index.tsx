import * as Buttons from '@Components/Buttons';
import { useWishlist } from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useEffect, useRef } from 'react';
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View,
	Animated,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import { WishlistStackParamList } from 'types';
import { SwipeListView } from 'react-native-swipe-list-view';
import {faTrash, faEllipsis} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface Props {
	route: RouteProp<WishlistStackParamList, 'Wishlist'>;
	navigation: NativeStackNavigationProp<WishlistStackParamList>;
}

interface HiddenProp{
	// swipeAnimatedValue: any,
	// rightActionActivated: any,
	// rowActionAnimatedValue: any,
	// rowHeightAnimatedValue: any,
}

const HiddenItem: FC<HiddenProp> = (props) => {
	//Properties for button animation
	// const {
	// 	swipeAnimatedValue,
	// 	rightActionActivated,
	// 	rowActionAnimatedValue,
	// 	rowHeightAnimatedValue,
	// } = props;

	// if (rightActionActivated) {
	// 	Animated.spring(rowActionAnimatedValue, {
	// 		toValue: 500,
	// 		useNativeDriver: false
	// 	}).start();
	// } else {
	// 	Animated.spring(rowActionAnimatedValue, {
	// 		toValue: 75,
	// 		useNativeDriver: false
	// 	}).start();
	// }
	
	const onDeleteItem = () => {
		console.log("Deleting Item...");
		
	}
	const onMore = () => {
		console.log("More...");
	}
	return (
		<View style={styles.rowBack}>
			<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={onMore}>
				<FontAwesomeIcon
					icon={faEllipsis}
					size={24}
					style={tw('text-white')}
				/>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={onDeleteItem}>
				<FontAwesomeIcon
					icon={faTrash}
					size={24}
					style={tw('text-white')}
				/>
			</TouchableOpacity>
		</View>

	//Animation for delete button
	// 	<Animated.View style={[styles.rowBack, {height: rowHeightAnimatedValue}]}>
	// 	{(
	// 		<Animated.View
	// 			style={[
	// 				styles.backRightBtn,
	// 				styles.backRightBtnRight,
	// 				{
	// 					flex: 1,
	// 					width: rowActionAnimatedValue,
	// 				},
	// 			]}>
	// 			<TouchableOpacity
	// 				style={[styles.backRightBtn, styles.backRightBtnRight]}
	// 				onPress={onDeleteItem}>
	// 				<Animated.View
	// 					style={[
	// 						styles.trash,
	// 						{
	// 							transform: [
	// 								{
	// 									scale: swipeAnimatedValue.interpolate({
	// 										inputRange: [-90, -45],
	// 										outputRange: [1, 0],
	// 										extrapolate: 'clamp',
	// 									}),
	// 								},
	// 							],
	// 						},
	// 					]}>
	// 				<FontAwesomeIcon
	// 					icon={faTrash}
	// 					size={24}
	// 					style={tw('text-white')}
	// 				/>
	// 				</Animated.View>
	// 			</TouchableOpacity>
	// 		</Animated.View>
	// 	)}
	// </Animated.View>
	);
};


const renderHidden = (data: any, rowMap: any) => {
	// const rowActionAnimatedValue = new Animated.Value(75);
	// const rowHeightAnimatedValue = new Animated.Value(60);

	return (
		<HiddenItem
			// data={data}
			// swipeAnimatedValue =  {100}
			// rightActionActivated = {true} 
			// rowActionAnimatedValue={rowActionAnimatedValue}
			// rowHeightAnimatedValue={rowHeightAnimatedValue}
			// onClose={() => closeRow(rowMap, data.item.key)}
			// onDelete={() => deleteRow(rowMap, data.item.key)}
		/>
	)
}

const Main: FC<Props> = ({ route, navigation }) => {
	const { wishlist, fetchWishlist, resetWishlist } = useWishlist('');
	const itemHandler = (listingId: string) => {
		navigation.navigate('Item', { listingId });
	};
	const scrollViewRef = useRef<ScrollView | undefined>();
	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY > 50) {
			fetchWishlist();
		} else if (offsetY < -50) {
			resetWishlist();
		}
	};
	useEffect(() => {
		if (route.params.reset === true) {
			resetWishlist();
		}
	}, [route]);
	const wishListData = wishlist;
	console.log(wishListData);
	
	return (
		<View style={tw('flex flex-1')}>
			{wishlist ? (
				// wishlist is fetched, render scroll view
				<>
					{wishlist.length > 0 ? (
						// wishlist is not empty, render scroll view
						<>
							{/* <ScrollView
								ref={scrollViewRef as any}
								onScrollEndDrag={onScrollEndDrag}
								contentContainerStyle={tw(
									'flex-col my-2 justify-center items-center'
								)}	
							> */}
									<SwipeListView
										data = {wishlist}
										renderItem={(data, index) => (
											//On WishList make this component deletable on swipe
											//set id here to index of the wishListData array
												<TouchableWithoutFeedback
													key={wishlist[data.index].id}
													style={tw('w-full')}
													onPress={() => itemHandler(wishlist[data.index].id)}
												>
													<View
														style={tw(
															'w-full', 'z-10', 'bg-white', `flex-row justify-between items-center py-2 ${
																data.index !== 0 ? 'border-t border-red-700' : ''
															}`
														)}
													>
														<FastImage
															source={{ uri: wishlist[data.index].thumbnail }}
															style={tw('w-16 h-16 rounded-lg mx-2')}
														/>
														<View style={tw('flex flex-1 break-words pl-2')}>
															<Text style={tw('text-lg font-bold')}>
																{wishlist[data.index].name}
															</Text>
														</View>
													</View>
												</TouchableWithoutFeedback>
												)}
											renderHiddenItem={renderHidden}
											// leftOpenValue={100}
											rightOpenValue={-120}
									></SwipeListView>

								{/* {wishlist.map((wishlistData, index) => (
									//On WishList make this component deletable on swipe
										<TouchableWithoutFeedback
											key={wishlistData.id}
											style={tw('w-full')}
											onPress={() => itemHandler(wishlistData.id)}
										>
											<View
												style={tw(
													`flex-row justify-between items-center mx-2 py-2 ${
														index !== 0 ? 'border-t border-red-700' : ''
													}`
												)}
											>
												<FastImage
													source={{ uri: wishlistData.thumbnail }}
													style={tw('w-16 h-16 rounded-lg')}
												/>
												<View style={tw('flex flex-1 break-words pl-2')}>
													<Text style={tw('text-lg font-bold')}>
														{wishlistData.name}
													</Text>
												</View>
											</View>
										</TouchableWithoutFeedback>
								))} */}
							{/* </ScrollView> */}
							{/* {fetchedAll && (
								<View style={tw('w-full')}>
									<Text>
										End of wishlist. Temporary implementation. Will implement a
										more friendly message.
									</Text>
								</View>
							)} */}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    // margin: 5,
    // marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 60,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#bdbdbd',
    right: 60,
  },
  backRightBtnRight: {
    backgroundColor: '#b042ff',
    right: 0,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#999',
  },
});

export default Main;
