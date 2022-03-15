import * as Buttons from '@Components/Buttons';
import { DEFAULT_MESSAGE_THUMBNAIL } from '@Constants';
import { UserContext } from '@Contexts';
import { db, fn, localTime, svTime } from '@firebase.config';
import {
	useHeights,
	useKeyboard,
	useParseMessage,
	useSeenIcons,
	useThreadData,
} from '@Hooks';
import logger from '@logger';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import {
	Button,
	Image,
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	Text,
	TextInput,
	View,
} from 'react-native';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { MessageData, MessageSeenAt, MessageStackParamList } from 'types';
import { v4 as uuidv4 } from 'uuid';
import Message from './Message';

interface Props {
	navigation: NativeStackNavigationProp<MessageStackParamList>;
	route: RouteProp<MessageStackParamList, 'Messages'>;
}
/**
 * renders button at header that goes back
 */
const renderBackButton = (navigation: Props['navigation']) => {
	useEffect(() => {
		const parentNavigation = navigation.getParent();
		if (parentNavigation) {
			parentNavigation.setOptions({
				headerLeft: () => (
					<Button title="back" onPress={() => navigation.goBack()} />
				),
			});
		}
	});
};

/**
 * Messages component, Threads contains Thread contains Messages contains Message
 */
const Messages: FC<Props> = ({ route, navigation }) => {
	renderBackButton(navigation);
	const { userInfo } = useContext(UserContext);
	const {
		threadData,
		setThreadMessagesData,
		isNewThread,
		setIsNewThread,
		fetchMessages,
	} = useThreadData(route.params.members);

	const { parsedMessages } = useParseMessage(threadData?.messages);
	const [inputMessage, setInputMessage] = useState<string>('');
	const [disableSend, setDisableSend] = useState<boolean>(false);
	const [messageStatus, setMessageStatus] = useState<
		undefined | 'sending' | 'sent' | 'seen'
	>();
	const scrollViewRef = useRef<ScrollView | undefined>();
	const textInputScrollViewRef = useRef<ScrollView | undefined>();
	const { willShow, didShow, keyboardHeight } = useKeyboard();
	const { tabsHeight } = useHeights();
	const { seenIcons } = useSeenIcons(threadData);

	// effect to scroll to latest message when focus on keyboard
	useEffect(() => {
		if (didShow) {
			scrollViewRef.current?.scrollToEnd();
		}
	}, [didShow]);

	const sendHandler = async () => {
		setDisableSend(true);
		if (threadData && userInfo) {
			if (inputMessage !== '') {
				setMessageStatus('sending');
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
					const seenAt: MessageSeenAt = {};
					threadData.membersUid.forEach((uid) => (seenAt[uid] = null));
					seenAt[userInfo.uid] = localTime();

					const newMessage: MessageData = {
						id: uuidv4(),
						sender: {
							uid: userInfo.uid,
							photoURL: userInfo.photoURL,
							displayName: userInfo.displayName,
						},
						membersUid: threadData.membersUid,
						content: inputMessage,
						contentType: 'text',
						threadName: threadData.name,
						time: svTime() as FirebaseFirestoreTypes.Timestamp,
						seenAt,
					};

					setInputMessage('');
					setDisableSend(false);
					setThreadMessagesData([
						...threadData.messages,
						{ ...newMessage, time: localTime() } as MessageData,
					]);
					await fn.httpsCallable('createMessage')({
						threadPreviewData,
						message: newMessage,
					});
					setMessageStatus('sent');
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
		scrollViewRef.current?.scrollToEnd();
	};

	const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const offsetY = e.nativeEvent.contentOffset.y;
		if (offsetY < -50) {
			fetchMessages();
		}
	};

	const readLatestMessage = async () => {
		if (threadData && userInfo) {
			const notSeenMessages = threadData.messages.filter(
				(x) => x.seenAt[userInfo.uid] === null
			);

			// convert notSeenMessages to seenMessages
			const seenMessages = notSeenMessages.map((x) => {
				return { ...x, seenAt: { ...x.seenAt, [userInfo.uid]: localTime() } };
			});

			try {
				const batch = db.batch();
				seenMessages.forEach((msg) => {
					batch.update(
						db
							.collection('threads')
							.doc(threadData.id)
							.collection('messages')
							.doc(msg.id),
						msg
					);
				});
				await batch.commit();
			} catch (error) {
				logger.error(error);
				Toast.show({ type: 'error', text1: 'Error while reading messages' });
			}
		}
	};

	return (
		<>
			{/* THREAD TITLE CONTAINER*/}
			<View
				style={tw('w-full bg-gray-300 flex justify-center items-center h-14')}
			>
				<Image
					source={{
						uri: userInfo?.photoURL
							? userInfo.photoURL
							: DEFAULT_MESSAGE_THUMBNAIL,
					}}
				/>
				{threadData && userInfo ? (
					<Text style={tw('text-s-xl font-medium')}>
						{threadData.name[userInfo.uid]}
					</Text>
				) : (
					<Text>Loading...</Text>
				)}
			</View>

			{/* MESSAGES AND TEXT INPUT CONTAINER */}
			<ScrollView
				contentContainerStyle={{
					...tw('flex flex-col-reverse flex-1'),
					paddingBottom: willShow ? keyboardHeight - tabsHeight : 0,
				}}
				scrollEnabled={false}
				nestedScrollEnabled={true}
				keyboardShouldPersistTaps="always"
			>
				{/* TEXT MESSAGE INPUT */}
				<View
					style={tw(
						'py-2 flex-row border-t border-b border-gray-400 bg-gray-300'
					)}
				>
					<ScrollView
						indicatorStyle="black"
						style={tw('max-h-32')}
						ref={textInputScrollViewRef as any}
					>
						<TextInput
							onLayout={() => textInputScrollViewRef.current?.scrollToEnd()}
							value={inputMessage}
							placeholder="Enter a message"
							style={tw('flex-1 mx-4 text-s-lg py-2')}
							multiline={true}
							onChangeText={setInputMessage}
							onFocus={() => readLatestMessage()}
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
				<View style={tw('flex flex-col-reverse mt-14')}>
					<ScrollView
						ref={scrollViewRef as any}
						onScrollEndDrag={onScrollEndDrag}
						onScroll={(e) => {
							const offsetY = e.nativeEvent.contentOffset.y;
							if (offsetY === 0) {
								readLatestMessage();
							}
						}}
						scrollEventThrottle={0}
						onContentSizeChange={() => {
							scrollViewRef.current?.scrollToEnd();
						}}
						contentContainerStyle={tw('flex flex-col')}
					>
						{parsedMessages ? (
							// parsedMessages defined
							<>
								{parsedMessages.length > 0 ? (
									<>
										{parsedMessages.map((message) => (
											<Message
												key={message.id}
												message={message}
												seenIcons={seenIcons}
											/>
										))}
									</>
								) : (
									<>
										<View style={tw('flex flex-1 justify-center items-center')}>
											<Text style={tw('text-s-lg')}>
												Send your first message
											</Text>
										</View>
									</>
								)}
							</>
						) : (
							<>
								<Text>Loading...</Text>
							</>
						)}

						{threadData?.messages[threadData.messages.length - 1]?.sender
							.uid === userInfo?.uid && (
							<View style={tw('absolute right-4 bottom-2')}>
								<Text style={tw('text-s-sm font-semibold')}>
									{messageStatus}
								</Text>
							</View>
						)}
					</ScrollView>
				</View>
			</ScrollView>
		</>
	);
};
export default Messages;
