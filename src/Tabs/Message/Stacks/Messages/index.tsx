import * as Buttons from '@Components/Buttons';
import { UserContext } from '@Contexts';
import { fn, localTime, svTime } from '@firebase.config';
import {
	useKeyboard,
	useKeyboardPadding,
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
	Animated,
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
import renderHeader from './renderHeader';

interface Props {
	navigation: NativeStackNavigationProp<MessageStackParamList>;
	route: RouteProp<MessageStackParamList, 'Messages'>;
}

/**
 * Messages component, Threads contains Thread contains Messages contains Message
 */
const Messages: FC<Props> = ({ route, navigation }) => {
	const { userInfo } = useContext(UserContext);
	const {
		threadData,
		setThreadMessagesData,
		isNewThread,
		setIsNewThread,
		fetchMessages,
	} = useThreadData(route.params.members);
	renderHeader(navigation, threadData);
	const { parsedMessages } = useParseMessage(threadData?.messages);
	const [inputMessage, setInputMessage] = useState<string>('');
	const [disableSend, setDisableSend] = useState<boolean>(false);
	const [messageStatus, setMessageStatus] = useState<
		undefined | 'sending' | 'sent' | 'seen'
	>();
	const scrollViewRef = useRef<ScrollView | undefined>();
	const textInputScrollViewRef = useRef<ScrollView | undefined>();
	const { didShow } = useKeyboard();
	const { seenIcons } = useSeenIcons(threadData);
	const [msgsWithSeenIconsIds, setMsgsWithSeenIconsIds] = useState<string[]>(
		[]
	);
	const { paddingBottom } = useKeyboardPadding();

	const [msgWithStatusId, setMsgWithStatusId] = useState<string | undefined>();
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
			const tobeSeenMessage = threadData.messages.filter((x) => {
				if ('seenAt' in x) {
					return x.seenAt[userInfo.uid] === null;
				} else {
					return false;
				}
			});
			const tobeSeenMessageIds = tobeSeenMessage.map((msg) => msg.id);
			try {
				await fn.httpsCallable('readMessages')({
					messageIds: tobeSeenMessageIds,
					threadId: threadData.id,
				});
			} catch (error) {
				logger.error(error);
				Toast.show({ type: 'error', text1: 'Error while reading messages' });
			}
		}
	};

	// effect to parse seenIcons and threadData into msgsWithSeenIconsIds
	useEffect(() => {
		if (threadData) {
			const msgsWithSeenIconsIds: string[] = [];
			const msgIds = threadData.messages.map((x) => x.id);
			for (const nonSelfUid in seenIcons) {
				if (typeof seenIcons[nonSelfUid] === 'string') {
					if (msgIds.includes(seenIcons[nonSelfUid] as string)) {
						msgsWithSeenIconsIds.push(seenIcons[nonSelfUid] as string);
					}
				}
			}
			setMsgsWithSeenIconsIds(msgsWithSeenIconsIds);
		}
	}, [seenIcons, threadData]);

	// effect to parse msgsWithSeenIconsIds and threadData into msgsWithStatusIds
	useEffect(() => {
		if (threadData && threadData.messages.length > 0 && userInfo && seenIcons) {
			let latestSelfMsg: MessageData = threadData.messages[0];
			threadData.messages.forEach((msg) => {
				if (msg.sender.uid === userInfo.uid) {
					if (latestSelfMsg.time.valueOf() <= msg.time.valueOf()) {
						latestSelfMsg = msg;
					}
				}
			});

			const msgsWithSeenIcon = msgsWithSeenIconsIds.map((msgId) =>
				threadData.messages.find((msg) => msg.id === msgId)
			);
			const nonSelfUids = threadData.membersUid.filter(
				(x) => x !== userInfo.uid
			);
			let latestSelfMsgIsNewerThanAllSeenMessages = true;

			msgsWithSeenIcon.forEach((msg) => {
				if (msg) {
					nonSelfUids.forEach((nonSelfUid) => {
						const msgSeenTime = msg.seenAt[nonSelfUid];
						const latestMsgSeenTime =
							latestSelfMsg.seenAt[userInfo.uid]?.valueOf();
						if (msgSeenTime && latestMsgSeenTime) {
							if (msgSeenTime.valueOf() >= latestMsgSeenTime.valueOf()) {
								latestSelfMsgIsNewerThanAllSeenMessages = false;
							}
						}
					});
				}
			});

			if (latestSelfMsgIsNewerThanAllSeenMessages === true) {
				setMsgWithStatusId(latestSelfMsg.id);
			}
		}
	}, [seenIcons, threadData, userInfo, msgsWithSeenIconsIds]);

	return (
		<>
			{/* MESSAGES AND TEXT INPUT CONTAINER */}
			<Animated.View style={{ ...tw('flex flex-1'), paddingBottom }}>
				<ScrollView
					contentContainerStyle={tw('flex flex-col-reverse flex-1')}
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
													msgsWithSeenIconsIds={msgsWithSeenIconsIds}
													msgWithStatusId={msgWithStatusId}
													messageStatus={messageStatus}
													nonSelfIcons={threadData?.members
														.filter((x) => x.uid !== userInfo?.uid)
														.map((x) => (x.photoURL ? x.photoURL : undefined))}
												/>
											))}
										</>
									) : (
										<>
											<View
												style={tw('flex flex-1 justify-center items-center')}
											>
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
						</ScrollView>
					</View>
				</ScrollView>
			</Animated.View>
		</>
	);
};
export default Messages;
