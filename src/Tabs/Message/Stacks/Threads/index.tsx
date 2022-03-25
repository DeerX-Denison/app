import * as Buttons from '@Components/Buttons';
import { UserContext } from '@Contexts';
import { useThreads } from '@Hooks';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { CircleSnail } from 'react-native-progress';
import Toast from 'react-native-toast-message';
import { MessageStackParamList, UserInfo } from 'types';
import useAutoComplete from '../../../../Hooks/useAutoComplete';
import ThreadPreview from './ThreadPreview';

interface Props {
	navigation: NativeStackNavigationProp<MessageStackParamList>;
}

/**
 * derenders button at header
 */
const derenderBackButton = (navigation: Props['navigation']) => {
	useEffect(() => {
		const parentNavigation = navigation.getParent();
		if (parentNavigation) {
			parentNavigation.setOptions({
				headerLeft: () => null,
			});
		} else {
			logger.error(`Parent navigation is undefined for Listings/Main`);
			Toast.show({
				type: 'error',
				text1: 'Unexpected error occured',
			});
		}
	});
};

/**
 * Threads components, Threads contains Thread contains Messages contains Message
 */
const Threads: FC<Props> = ({ navigation }) => {
	derenderBackButton(navigation);
	const { userInfo } = useContext(UserContext);
	const { threads, fetchThreads, resetThreads } = useThreads();

	const [searching, setSearching] = useState<boolean>(false);
	const { query, setQuery, suggestions } = useAutoComplete();
	const scrollViewRef = useRef<ScrollView | undefined>();
	const textInputRef = useRef<TextInput | undefined>();
	const suggestionHandler = (suggestion: UserInfo) => {
		if (userInfo) {
			navigation.navigate('Messages', {
				members: [
					{
						uid: userInfo.uid,
						email: userInfo.email,
						displayName: userInfo.displayName,
						photoURL: userInfo.photoURL,
					},
					{
						uid: suggestion.uid,
						email: suggestion.email,
						displayName: suggestion.displayName,
						photoURL: suggestion.photoURL,
					},
				],
			});
		}
	};

	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY > 50) {
			fetchThreads();
		} else if (offsetY < -50) {
			resetThreads();
		}
	};

	return (
		<ScrollView
			scrollEnabled={false}
			bounces={false}
			contentContainerStyle={tw('flex flex-col flex-1 bg-pink-200')}
			keyboardShouldPersistTaps="handled"
		>
			<TextInput
				ref={textInputRef as any}
				placeholder="Find Friends"
				placeholderTextColor={'gray'}
				value={query}
				onChangeText={setQuery}
				style={tw('text-s-md font-normal border rounded-lg p-2 m-2')}
				autoCapitalize="none"
				onFocus={() => setSearching(true)}
				onBlur={() => setSearching(false)}
			/>
			{searching ? (
				// User is searching, render search Component
				<View style={tw('flex flex-col flex-1')}>
					{suggestions !== undefined ? (
						// suggestions are fetching
						<>
							{suggestions === null ? (
								// still fetching, render circle snail
								<View
									style={tw(
										'flex flex-col justify-center items-center border rounded-md m-2 p-2 bg-gray-50'
									)}
								>
									<CircleSnail
										size={40}
										indeterminate={true}
										color={['red', 'green', 'blue']}
									/>
								</View>
							) : (
								// fetched
								<View
									style={tw(
										'flex flex-col justify-center border rounded-md m-2 p-2 bg-gray-50'
									)}
								>
									{suggestions.length > 0 ? (
										// fetched suggestions is not empty, render suggestions
										<>
											{suggestions.map((suggestion) => (
												<TouchableOpacity
													key={suggestion.uid}
													onPress={() => suggestionHandler(suggestion)}
													style={tw('w-full')}
												>
													<View style={tw('p-2 text-s-md')}>
														<Text>{suggestion.email}</Text>
													</View>
												</TouchableOpacity>
											))}
										</>
									) : (
										// fetched suggestions is empty, render empty message
										<View style={tw('w-full p-2 text-s-md')}>
											<Text>No user found</Text>
										</View>
									)}
								</View>
							)}
						</>
					) : (
						// suggestions not beginning to fetched, render nothing
						<></>
					)}
					{/* <View style={tw('w-full p-2 border-b')}>
						<Text style={tw('text-s-lg')}>Recent</Text>
					</View>
					<ScrollView>
						<View></View>
					</ScrollView> */}
				</View>
			) : (
				// User is not searching, render threads
				<ScrollView
					ref={scrollViewRef as any}
					contentContainerStyle={tw('mx-2 flex-1')}
					onScrollEndDrag={onScrollEndDrag}
				>
					{threads ? (
						// thread is fetched, render threads
						<>
							{threads.length > 0 ? (
								// thread is not empty, render all the threads
								<>
									{threads.map((threadPreviewData) => (
										<ThreadPreview
											key={threadPreviewData.id}
											threadPreviewData={threadPreviewData}
											navigation={navigation}
										/>
									))}
								</>
							) : (
								// thread is empty, display empty thread message
								<>
									<View
										style={tw(
											'absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center -z-10'
										)}
									>
										<Text style={tw('text-s-md font-semibold p-4')}>
											It's lonely here.
										</Text>
										<Buttons.Primary
											size="md"
											title="Find friends"
											onPress={() => {
												setSearching(true);
												textInputRef.current?.focus();
											}}
										/>
									</View>
								</>
							)}
						</>
					) : (
						// thread is not fetched, render loading
						<>
							<View
								testID="loading"
								style={tw(
									'absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center -z-10'
								)}
							>
								<CircleSnail
									size={80}
									indeterminate={true}
									color={['red', 'green', 'blue']}
								/>
							</View>
						</>
					)}
				</ScrollView>
			)}
		</ScrollView>
	);
};
export default Threads;
