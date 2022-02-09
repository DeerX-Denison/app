import * as Buttons from '@Components/Buttons';
import { useWishlist } from '@Hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useRef } from 'react';
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import { WishlistStackParamList } from 'types';

interface Props {
	navigation: NativeStackNavigationProp<WishlistStackParamList>;
}

const Main: FC<Props> = ({ navigation }) => {
	const { wishlist, fetchWishlist, resetWishlist, fetchedAll } = useWishlist();
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

	return (
		<View style={tw('flex flex-1')}>
			<Text style={tw('font-bold text-s-lg py-4 text-center')}>Wishlist</Text>
			{wishlist ? (
				// wishlist is fetched, render scroll view
				<>
					{wishlist.length > 0 ? (
						// wishlist is not empty, render scroll view
						<>
							<ScrollView
								ref={scrollViewRef as any}
								onScrollEndDrag={onScrollEndDrag}
								contentContainerStyle={tw(
									'flex-col my-2 justify-center items-center'
								)}
							>
								{wishlist.map((wishlistData) => (
									<TouchableWithoutFeedback
										key={wishlistData.id}
										style={tw('w-full')}
										onPress={() => itemHandler(wishlistData.id)}
									>
										<View
											style={tw(
												'w-full p-2 flex-row justify-between items-center border-t'
											)}
										>
											<FastImage
												source={{ uri: wishlistData.thumbnail }}
												style={tw('w-16 h-16')}
											/>
											<Text style={tw('text-lg font-bold')}>
												{wishlistData.name}
											</Text>
											<Buttons.Primary
												title="View"
												onPress={() => itemHandler(wishlistData.id)}
												size="sm"
											/>
										</View>
									</TouchableWithoutFeedback>
								))}
							</ScrollView>
							{fetchedAll && (
								<View style={tw('w-full')}>
									<Text>
										End of wishlist. Temporary implementation. Will implement a
										more friendly message.
									</Text>
								</View>
							)}
						</>
					) : (
						// wishlist is empty, display empty message
						<>
							<View
								style={tw('flex flex-col flex-1 justify-center items-center')}
							>
								<Text>Wishlist is empty</Text>
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
