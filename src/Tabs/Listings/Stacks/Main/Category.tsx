import * as Badges from '@Components/Badges';
import { CATEGORIES } from '@Constants';
import tw from '@tw';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
	Animated,
	Keyboard,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListingCategory } from 'types';
import addCategory from './addCategory';

interface Props {
	category: ListingCategory[];
	setCategory: React.Dispatch<React.SetStateAction<ListingCategory[]>>;
	categorizing: boolean;
	setCategorizing: React.Dispatch<React.SetStateAction<boolean>>;
}

const categories = CATEGORIES;
/**
 * category component when user wants to search for category
 */
const Category: FC<Props> = ({
	category,
	setCategory,
	categorizing,
	setCategorizing,
}) => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<
		ListingCategory[] | undefined | null
	>();
	const inputTextRef = useRef<TextInput | undefined>();
	const { height } = useWindowDimensions();

	const translation = useRef(new Animated.Value(height)).current;
	// animate category sliding bottom up
	useEffect(() => {
		if (categorizing) {
			inputTextRef.current?.focus();
			Animated.timing(translation, {
				toValue: 0,
				useNativeDriver: true,
				duration: 250,
			}).start();
		} else {
			Keyboard.dismiss();
			Animated.timing(translation, {
				toValue: height,
				useNativeDriver: true,
				duration: 250,
			}).start();
		}
	}, [categorizing, inputTextRef.current]);

	useEffect(() => {
		if (categories) {
			setSuggestions(categories.filter((x) => x.includes(query.toUpperCase())));
		} else {
			setSuggestions(null);
		}
	}, [query]);

	return (
		<Animated.View
			style={{
				...tw('bg-gray-50 absolute z-10 w-full h-full'),
				transform: [{ translateY: translation }],
			}}
		>
			<View style={tw('w-full')}>
				<TextInput
					ref={inputTextRef as any}
					value={query}
					style={tw('py-3 px-6 border rounded-full m-2 text-s-lg')}
					placeholder="Search categories"
					onChangeText={setQuery}
				/>
			</View>
			<ScrollView
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="always"
				contentContainerStyle={tw('flex flex-col flex-1')}
			>
				<>
					{suggestions ? (
						// suggestions has finished querying
						<>
							{suggestions.length > 0 ? (
								// suggestions is not empty
								<>
									<View style={tw('flex flex-row flex-wrap')}>
										{suggestions.map((suggestion) => (
											<TouchableOpacity
												key={suggestion}
												onPress={() =>
													addCategory(
														suggestion,
														category,
														setCategory,
														setCategorizing,
														setQuery
													)
												}
											>
												<Badges.Light>
													<Icon name="plus" size={16} style={tw('m-1')} />
													<Text style={tw('capitalize text-s-md pr-2')}>
														{suggestion}
													</Text>
												</Badges.Light>
											</TouchableOpacity>
										))}
									</View>
								</>
							) : (
								// suggestions is empty
								<>
									<View
										style={tw(
											'flex flex-col flex-1 justify-center items-center'
										)}
									>
										<Text style={tw('text-s-md font-semibold p-4')}>
											No category found
										</Text>
									</View>
								</>
							)}
						</>
					) : (
						// suggestions is being queried, render loading
						<>
							<View>
								<Text>Loading</Text>
							</View>
						</>
					)}
				</>
			</ScrollView>
		</Animated.View>
	);
};

export default Category;
