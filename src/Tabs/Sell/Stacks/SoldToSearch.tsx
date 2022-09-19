import { DEFAULT_USER_PHOTO_URL } from '@Constants';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useSoldToSearchSuggestion } from '@Hooks';
import tw from '@tw';
import React, { FC, useRef, useState } from 'react';
import {
	Animated,
	NativeScrollEvent,
	NativeSyntheticEvent,
	RefreshControl,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import { UserInfo } from 'types';
import useSoldToSearchSlide from './MyListings/useSoldToSearchSlide';
interface Props {
	showingSearch: boolean;
	setShowingSearch: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedSoldTo: React.Dispatch<
		React.SetStateAction<UserInfo | null | undefined>
	>;
	setHasEditStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const SoldToSearch: FC<Props> = ({
	showingSearch,
	setShowingSearch,
	setSelectedSoldTo,
	setHasEditStatus,
}) => {
	const [query, setQuery] = useState('');
	const { suggestions, fetchSuggestion, resetSuggestion } =
		useSoldToSearchSuggestion(query);
	const inputTextRef = useRef<TextInput | undefined>();
	const { translation } = useSoldToSearchSlide(showingSearch, inputTextRef);

	const selectSuggestionHandler = (soldTo: UserInfo) => {
		setSelectedSoldTo(soldTo);
		setShowingSearch(false);
		setHasEditStatus(true);
	};

	// when user scroll down to bottom
	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY > 50) {
			fetchSuggestion();
		}
	};

	// state for refresh control thread preview scroll view
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = async () => {
		setRefreshing(true);
		await resetSuggestion();
		setRefreshing(false);
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
					placeholder="Search Users"
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
				onScrollEndDrag={onScrollEndDrag}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						// size={24}
					/>
				}
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
								onPress={() => selectSuggestionHandler(suggestion)}
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
