import tw from '@tw';
import React, { FC } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import 'react-native-get-random-values';
import { CircleSnail } from 'react-native-progress';
import { InputTextRef, TextSelection, WishlistDataCL } from 'types';
interface Props {
	query: string | null;
	wishlist: WishlistDataCL[] | null | undefined;
	inputText: string | undefined;
	textSelection: TextSelection;
	setTextSelection: React.Dispatch<React.SetStateAction<TextSelection>>;
	refs: InputTextRef[];
	setRefs: React.Dispatch<React.SetStateAction<InputTextRef[]>>;
	setInputText: React.Dispatch<React.SetStateAction<string>>;
}

const ItemSuggestion: FC<Props> = ({
	query,
	wishlist,
	inputText,
	textSelection,
	refs,
	setRefs,
	setInputText,
}) => {
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
								onPress={() => {
									let closestRef = 0;
									for (let i: number = textSelection.start; i >= 0; i--) {
										if (inputText?.charAt(i) === '@') {
											closestRef = i;
											break;
										}
									}
									const typedRef = textSelection.start - closestRef - 1;
									const start: number = closestRef;
									const end: number = start + wishlistData.name.length;
									const newRef: InputTextRef = {
										end: end,
										begin: start,
										data: wishlistData,
									};
									setInputText(
										inputText?.slice(0, closestRef + 1) +
											wishlistData.name +
											' ' +
											inputText?.slice(textSelection?.start, inputText.length)
									);
									const mutableRefs = refs.map((x) => x);
									for (let i = 0; i < mutableRefs.length; i++) {
										if (closestRef <= mutableRefs[i].begin) {
											mutableRefs[i].begin +=
												wishlistData.name.length - typedRef + 1;
											mutableRefs[i].end +=
												wishlistData.name.length - typedRef + 1;
										}
									}
									mutableRefs.push(newRef);
									mutableRefs.sort((a, b) => a.begin - b.begin);
									setRefs(mutableRefs);
								}}
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
