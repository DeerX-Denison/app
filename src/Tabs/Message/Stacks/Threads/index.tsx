import * as Buttons from '@Components/Buttons';
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
	View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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

	const newThreadHandler = () => {
		setSearching(!searching);
	};

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
			ref={scrollViewRef as any}
			contentContainerStyle={tw('mx-2 flex-1')}
			onScrollEndDrag={onScrollEndDrag}
		>
			<View style={tw('m-2')}>
				<Buttons.Primary
					title="new thread"
					onPress={newThreadHandler}
					size="md"
				/>
			</View>
			{searching && (
				// user is searching, render text input for query
				<>
					<Inputs.Text
						placeholder="Big Red ID"
						placeholderTextColor={'gray'}
						value={query}
						onChangeText={setQuery}
						style={tw('text-s-md font-normal border rounded-lg p-2 m-2')}
						autoCapitalize="none"
					/>
					{suggestions ? (
						// suggestions are fetched
						<>
							{suggestions.length > 0 && (
								// fetched suggestions is not empty
								<View
									style={tw(
										'flex flex-col justify-center border rounded-md m-2 p-2 bg-gray-50'
									)}
								>
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
								</View>
							)}
						</>
					) : (
						// suggestions not fetched, render loading
						<>
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
						</>
					)}
				</>
			)}
			{fetchedAll && (
				<View style={tw('w-full')}>
					<Text>
						End of threads. Temporary implementation. Will disable scroll to
						fetch when end of threads.
					</Text>
				</View>
			)}
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
								<Text>It's lonely here. Wanna start a message?</Text>
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
	);
};
export default Threads;
