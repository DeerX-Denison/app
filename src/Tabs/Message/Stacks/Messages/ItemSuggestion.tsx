import tw from '@tw';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { CircleSnail } from 'react-native-progress';
import { WishlistDataCL } from 'types';
interface Props {
	query: string | null;
	wishlist: WishlistDataCL[] | null | undefined;
}

const ItemSuggestion: FC<Props> = ({ query, wishlist }) => {
	return (
		<View style={tw('flex flex-col border-t border-b')}>
			{wishlist && wishlist.length > 0 && (
				<>
					<ScrollView>
						{wishlist.map((wishlistData, index) => (
							<TouchableOpacity
								key={wishlistData.id}
								style={tw(
									`flex flex-row px-4 py-1 items-center ${
										index === wishlist.length - 1 ? '' : 'border-b'
									}`
								)}
							>
								<FastImage
									source={{ uri: wishlistData.thumbnail }}
									style={tw('h-16 w-16')}
								/>
								<View style={tw('flex flex-col h-16 px-2 my-1 justify-evenly')}>
									<Text style={tw('text-s-lg font-semibold')}>
										{wishlistData.name}
									</Text>
									<Text style={tw('text-s-md font-normal')}>
										${wishlistData.price}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				</>
			)}
			{wishlist && wishlist.length === 0 && (
				<>
					<View style={tw('px-4 py-2')}>
						<Text style={tw('text-s-lg font-bold pb-1')}>
							{query && query.length === 0
								? 'No item in wishlist'
								: 'No item found'}
						</Text>
						<Text style={tw('text-s-md font-normal pt-1')}>
							Add item to wishlist to mention them here
						</Text>
					</View>
				</>
			)}
			{!wishlist && (
				<View style={tw('h-16 justify-center items-center')} testID="loading">
					<CircleSnail
						size={40}
						indeterminate={true}
						color={['red', 'green', 'blue']}
					/>
				</View>
			)}
		</View>
	);
};

export default ItemSuggestion;
