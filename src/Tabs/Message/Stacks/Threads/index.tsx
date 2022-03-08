import * as Inputs from '@Components/Inputs';
import { UserContext } from '@Contexts';
import { useThreads } from '@Hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { CircleSnail } from 'react-native-progress';
import { MessageStackParamList, UserInfo } from 'types';
import useAutoComplete from '../../../../Hooks/useAutoComplete';
import ThreadPreview from './ThreadPreview';

interface Props {
	navigation: NativeStackNavigationProp<MessageStackParamList>;
	directThreadMembers: UserInfo[] | undefined;
}

/**
 * custom hook to redirect to a thread when directThreadMember is defined
 */
const useDirectThread = (
	user: UserInfo | null,
	directThreadMembers: UserInfo[] | undefined,
	navigation: NativeStackNavigationProp<MessageStackParamList>
) => {
	useEffect(() => {
		if (user && directThreadMembers) {
			const directThreadMember = directThreadMembers[0];
			navigation.navigate('Messages', {
				members: [
					{
						uid: user.uid,
						email: user.email,
						displayName: user.displayName,
						photoURL: user.photoURL,
					},
					{
						uid: directThreadMember.uid,
						email: directThreadMember.email,
						displayName: directThreadMember.displayName,
						photoURL: directThreadMember.photoURL,
					},
				],
			});
		}
	}, [directThreadMembers]);
};

/**
 * Threads components, Threads contains Thread contains Messages contains Message
 */
const Threads: FC<Props> = ({ navigation, directThreadMembers }) => {
	const user = useContext(UserContext);
	useDirectThread(user, directThreadMembers, navigation);
	const { threads, fetchThreads, resetThreads, fetchedAll } = useThreads();
	const [searching, setSearching] = useState<boolean>(false);
	const { query, setQuery, suggestions } = useAutoComplete();
	const scrollViewRef = useRef<ScrollView | undefined>();

	const suggestionHandler = (suggestion: UserInfo) => {
		if (user) {
			navigation.navigate('Messages', {
				members: [
					{
						uid: user.uid,
						email: user.email,
						displayName: user.displayName,
						photoURL: user.photoURL,
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
			contentContainerStyle={tw('flex flex-col flex-1')}
			keyboardShouldPersistTaps="handled"
		>
			<Inputs.Text
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
										<Text style={tw('text-s-lg p-4')}>It's lonely here.</Text>
										<Text style={tw('text-s-lg p-4')}>
											Wanna start a message?
										</Text>
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
