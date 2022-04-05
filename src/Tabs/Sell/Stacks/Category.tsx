import * as Badges from '@Components/Badges';
import { CATEGORIES } from '@Constants';
import { useSlideAnimation } from '@Hooks';
import tw from '@tw';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
	Animated,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ListingErrors } from 'src/Hooks/useListingError';
import { ListingCategory, ListingData } from 'types';
import addCategory from './addCategory';

interface Props {
	listingData: ListingData | null | undefined;
	listingErrors: ListingErrors;
	setListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>;
	categorizing: boolean;
	setCategorizing: React.Dispatch<React.SetStateAction<boolean>>;
}

const categories = CATEGORIES;
/**
 * category component when user wants to search for category
 */
const Category: FC<Props> = ({
	listingData,
	listingErrors,
	setListingData,
	categorizing,
	setCategorizing,
}) => {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<
		ListingCategory[] | undefined | null
	>();
	const inputTextRef = useRef<TextInput | undefined>();
	const { translation } = useSlideAnimation(categorizing, inputTextRef);

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
					style={tw('py-3 pl-12 pr-6 border rounded-full m-2 text-s-lg')}
					placeholder="Search categories"
					onChangeText={setQuery}
				/>
				<TouchableOpacity
					style={tw('absolute left-0 h-full justify-center pl-6')}
					onPress={() => setCategorizing(false)}
				>
					<Icon name="chevron-left" size={18} />
				</TouchableOpacity>
			</View>
			<ScrollView
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="always"
				style={tw('flex flex-col flex-1')}
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
														listingData,
														setListingData,
														setCategorizing,
														setQuery,
														listingErrors
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
									<View>
										<Text>No category found</Text>
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
