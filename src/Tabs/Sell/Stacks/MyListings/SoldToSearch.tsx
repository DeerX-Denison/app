import { DEFAULT_USER_PHOTO_URL } from '@Constants';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import tw from '@tw';
import React, { FC, useRef, useState } from 'react';
import {
	Animated,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import { ListingId } from 'types';
import useSoldToSearchSlide from './useSoldToSearchSlide';
import useSoldToSearchSuggestion from './useSoldToSearchSuggestion';
interface Props {
	showingSearch: boolean;
	setShowingSearch: React.Dispatch<React.SetStateAction<boolean>>;
	selectedListingId: string | undefined;
	markAsSoldHandler: (listingId: ListingId, soldToUid: string) => void;
}

const SoldToSearch: FC<Props> = ({
	showingSearch,
	setShowingSearch,
	selectedListingId,
	markAsSoldHandler,
}) => {
	const [query, setQuery] = useState('');
	const { suggestions } = useSoldToSearchSuggestion(query);
	const inputTextRef = useRef<TextInput | undefined>();
	const { translation } = useSoldToSearchSlide(showingSearch, inputTextRef);

	const selectSuggestionHandler = (soldToUid: string) => {
		if (selectedListingId) {
			markAsSoldHandler(selectedListingId, soldToUid);
			setShowingSearch(false);
		}
	};

	return (
		<Animated.View
			style={{
				...tw('bg-gray absolute z-10 w-full h-full'),
				transform: [{ translateY: translation }],
			}}
		>
			<View style={tw('w-full')}>
				<TextInput
					ref={inputTextRef as any}
					value={query}
					style={tw(
						'py-3 pl-12 pr-6 border border-denison-red rounded-full m-2 text-s-lg bg-white'
					)}
					placeholder="Search categories"
					onChangeText={setQuery}
				/>
				<TouchableOpacity
					style={tw('absolute left-0 h-full justify-center pl-6')}
					onPress={() => setShowingSearch(false)}
				>
					<FontAwesomeIcon
						icon={faChevronLeft}
						size={16}
						style={tw('text-denison-red')}
					/>
				</TouchableOpacity>
			</View>
			<ScrollView
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="always"
				style={tw('flex flex-col flex-1')}
			>
				{suggestions && suggestions.length > 0 && (
					<View
						style={tw('flex flex-col m-2 border border-denison-red rounded-xl')}
					>
						{suggestions.map((suggestion, index) => (
							<TouchableOpacity
								key={suggestion.uid}
								style={tw(
									`flex flex-row flex-1 p-3 border-denison-red ${
										index !== suggestions.length - 1 ? 'border-b' : ''
									}`
								)}
								onPress={() => selectSuggestionHandler(suggestion.uid)}
							>
								<FastImage
									source={{
										uri: suggestion.photoURL
											? suggestion.photoURL
											: DEFAULT_USER_PHOTO_URL,
									}}
									style={tw('h-12 w-12 rounded-full')}
								/>
								<View style={tw('flex flex-1 justify-center')}>
									<Text
										style={tw('text-s-lg font-semibold text-denison-red ml-4')}
									>
										{suggestion.displayName}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</View>
				)}
			</ScrollView>
			{suggestions === null && (
				<View
					style={tw('absolute -z-10 w-full h-full justify-center items-center')}
				>
					<Text style={tw('text-s-md text-denison-red font-semibold')}>
						Error Querying Users
					</Text>
				</View>
			)}
			{suggestions === undefined && (
				<View
					style={tw('absolute -z-10 w-full h-full justify-center items-center')}
				>
					<CircleSnail
						size={80}
						indeterminate={true}
						color={['red', 'green', 'blue']}
					/>
				</View>
			)}
			{suggestions && suggestions.length === 0 && (
				<View
					style={tw('absolute -z-10 w-full h-full justify-center items-center')}
				>
					<Text style={tw('text-s-md text-denison-red font-semibold')}>
						You Can Only Mark A Listing As Sold
					</Text>
					<Text style={tw('text-s-md text-denison-red font-semibold pt-4')}>
						To Users You Have Messaged
					</Text>
				</View>
			)}
		</Animated.View>
	);
};

export default SoldToSearch;
