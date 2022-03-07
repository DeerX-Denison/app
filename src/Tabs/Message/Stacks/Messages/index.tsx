import * as Buttons from '@Components/Buttons';
import * as Inputs from '@Components/Inputs';
import { DEFAULT_MESSAGE_THUMBNAIL } from '@Constants';
import { UserContext } from '@Contexts';
import { fn, svTime } from '@firebase.config';
import { useHeights, useParseMessage, useThreadData } from '@Hooks';
import logger from '@logger';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useRef, useState } from 'react';
import {
	Image,
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	Text,
	View,
} from 'react-native';
import 'react-native-get-random-values';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { MessageData, MessageStackParamList } from 'types';
import { v4 as uuidv4 } from 'uuid';
import Message from './Message';

interface Props {
	navigation: NativeStackNavigationProp<MessageStackParamList>;
	route: RouteProp<MessageStackParamList, 'Messages'>;
}

/**
 * Messages component, Threads contains Thread contains Messages contains Message
 */
const Messages: FC<Props> = ({ route }) => {
	const user = useContext(UserContext);
	const {
		threadData,
		isNewThread,
		setIsNewThread,
		fetchMessages,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		resetMessages,
		fetchedAll,
	} = useThreadData(route.params.members);
	const { parsedMessages } = useParseMessage(threadData?.messages);
	const {
		inputHeight,
		setInputHeight,
		tabsHeight,
		windowHeight,
		headerHeight,
	} = useHeights();
	const [inputMessage, setInputMessage] = useState<string>('');
	const [disableSend, setDisableSend] = useState<boolean>(false);
	const scrollViewRef = useRef<ScrollView | undefined>();

	const sendHandler = async () => {
		setDisableSend(true);
		if (threadData && user) {
			if (inputMessage !== '') {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { messages, ...threadPreviewData } = threadData;
				if (isNewThread) {
					try {
						await fn.httpsCallable('createThread')(threadPreviewData);
					} catch (error) {
						return logger.log(error);
					}
					setIsNewThread(false);
				}
				try {
					const newMessage: MessageData = {
						id: uuidv4(),
						sender: {
							uid: user.uid,
							photoURL: user.photoURL,
							displayName: user.displayName,
						},
						membersUid: threadData.membersUid,
						content: inputMessage,
						contentType: 'text',
						threadName: threadData.name,
						time: svTime() as FirebaseFirestoreTypes.Timestamp,
					};
					await fn.httpsCallable('createMessage')({
						threadPreviewData,
						message: newMessage,
					});
					setInputMessage('');
				} catch (error) {
					logger.log(error);
					return Toast.show({
						type: 'error',
						text1: 'An unexpected error has occured',
						text2: 'Please try again later',
					});
				}
			}
		} else {
			// error handling
		}
		scrollViewRef.current?.scrollToEnd({ animated: true });
		setDisableSend(false);
	};

	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY < -50) {
			fetchMessages();
		}
	};

	const [a, setA] = useState<number>(
		windowHeight - tabsHeight - headerHeight - 54
	);
	return (
		<>
			{/* {fetchedAll && (
				<Text>
					Fetched all messages. Temporary implementation. Will implement a more
					user friendly message.
				</Text>
			)} */}

			{/* THREAD TITLE CONTAINER*/}
			<View
				style={tw('w-full bg-gray-300 flex justify-center items-center h-14')}
			>
				<Image
					source={{
						uri: user?.photoURL ? user.photoURL : DEFAULT_MESSAGE_THUMBNAIL,
					}}
				/>
				{threadData && user ? (
					<Text style={tw('text-s-xl font-medium')}>
						{threadData.name[user.uid]}
					</Text>
				) : (
					<Text>Loading...</Text>
				)}
			</View>

			{/* MESSAGES AND TEXT INPUT CONTAINER */}
			<KeyboardAwareScrollView
				scrollEnabled={false}
				nestedScrollEnabled={true}
				alwaysBounceVertical={false}
				showsVerticalScrollIndicator={false}
				viewIsInsideTabBar={true}
				extraHeight={tabsHeight + inputHeight + headerHeight}
				keyboardOpeningTime={250}
				keyboardShouldPersistTaps="always"
				contentContainerStyle={{
					...tw('flex flex-col-reverse pt-14'),
					height: a,
				}}
				onKeyboardWillShow={(frame) =>
					setA(a - frame.startCoordinates.height - 24)
				}
				onKeyboardWillHide={() =>
					setA(windowHeight - tabsHeight - headerHeight - 54)
				}
			>
				{/* TEXT MESSAGE INPUT */}
				<View
					onLayout={(e) => setInputHeight(e.nativeEvent.layout.height)}
					style={tw(
						'py-2 flex-row border-t border-b border-gray-400 bg-gray-300'
					)}
				>
					<ScrollView indicatorStyle="black" style={tw('max-h-32')}>
						<Inputs.Text
							value={inputMessage}
							placeholder="Enter a message"
							style={tw('flex-1 mx-4 text-s-lg py-2')}
							multiline={true}
							onChangeText={setInputMessage}
						/>
					</ScrollView>
					<View style={tw('flex-col justify-end')}>
						<View style={tw('pr-4')}>
							<Buttons.Primary
								title="Send"
								onPress={sendHandler}
								size="md"
								disabled={disableSend}
							/>
						</View>
					</View>
				</View>

				{/* MESSAGES CONTAINER */}
				<View>
					<ScrollView
						contentContainerStyle={{
							backgroundColor: 'pink',
						}}
						ref={scrollViewRef as any}
						onScrollEndDrag={onScrollEndDrag}
					>
						{parsedMessages ? (
							// parsedMessages defined
							<>
								{parsedMessages.length > 0 ? (
									<>
										{parsedMessages.map((message) => (
											<Message key={message.id} message={message} />
										))}
									</>
								) : (
									<>
										<Text>Send your first message</Text>
									</>
								)}
							</>
						) : (
							<>
								<Text>Loading...</Text>
							</>
						)}
					</ScrollView>
				</View>
			</KeyboardAwareScrollView>
		</>
	);
};
export default Messages;
