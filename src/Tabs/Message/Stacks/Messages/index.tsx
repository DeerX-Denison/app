import * as Buttons from '@Components/Buttons';
import { UserContext } from '@Contexts';
import { fn, localTime } from '@firebase.config';
import {
	useKeyboard,
	useKeyboardPadding,
	useMessage,
	useParseMessage,
	useSeenIcons,
	useThreadData,
	useWishlist,
} from '@Hooks';
import logger from '@logger';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useRef, useState } from 'react';
import { Animated, ScrollView, Text, TextInput, View } from 'react-native';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { MessageData, MessageStackParamList } from 'types';
import ItemSuggestion from './ItemSuggestion';
import Message from './Message';
import readLatestMessage from './readLatestMessage';
import renderHeader from './renderHeader';
import useMsgWithSeenIconIds from './useMsgWithSeenIconIds';
import useMsgWithStatusId from './useMsgWithStatusId';
import useScrollToEndOnKeyboard from './useScrollToEndOnKeyboard';

interface Props {
	navigation: NativeStackNavigationProp<MessageStackParamList>;
	route: RouteProp<MessageStackParamList, 'Messages'>;
}

/**
 * Messages component, Threads contains Thread contains Messages contains Message
 */
const Messages: FC<Props> = ({ route, navigation }) => {
	const { userInfo } = useContext(UserContext);
	const scrollViewRef = useRef<ScrollView | undefined>();
	const {
		threadData,
		setThreadMessagesData,
		isNewThread,
		setIsNewThread,
		fetchMessages,
	} = useThreadData(route.params.members);
	renderHeader(navigation, threadData);
	const { parsedMessages } = useParseMessage(threadData?.messages);
	const [disableSend, setDisableSend] = useState<boolean>(false);
	const [messageStatus, setMessageStatus] = useState<
		undefined | 'sending' | 'sent' | 'seen'
	>();
	const { seenIcons } = useSeenIcons(threadData);
	const { msgsWithSeenIconsIds } = useMsgWithSeenIconIds(seenIcons, threadData);
	const { msgWithStatusId } = useMsgWithStatusId(
		threadData,
		msgsWithSeenIconsIds
	);
	const { didShow } = useKeyboard();
	useScrollToEndOnKeyboard(didShow, scrollViewRef);
	const { paddingBottom } = useKeyboardPadding();

	const { message, inputText, setInputText, showingItem, query } =
		useMessage(threadData);

	const { wishlist } = useWishlist(query);

	const sendHandler = async () => {
		setInputText('');
		setDisableSend(true);
		if (threadData && userInfo) {
			if (inputText !== '') {
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
					setThreadMessagesData([
						...threadData.messages,
						{ ...message, time: localTime() } as MessageData,
					]);
					setDisableSend(false);
					await fn.httpsCallable('createMessage')({
						threadPreviewData,
						message,
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
					<View style={tw('flex flex-col-reverse')}>
						<View
							style={tw(
								'py-2 flex-row border-t border-b border-gray-400 bg-gray-300'
							)}
						>
							<TextInput
								value={inputText}
								placeholder="Enter a message"
								style={tw('flex-1 mx-4 text-s-lg py-2 max-h-32')}
								multiline={true}
								scrollEnabled={true}
								onChangeText={setInputText}
								onFocus={() => readLatestMessage(threadData, userInfo)}
								autoCorrect={false}
							/>
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
						{showingItem && (
							<ItemSuggestion query={query} wishlist={wishlist} />
						)}
					</View>

					{/* MESSAGES CONTAINER */}
					<View style={tw('flex flex-col-reverse justify-start justify-end')}>
						<ScrollView
							ref={scrollViewRef as any}
							onScrollEndDrag={(e) => {
								const offsetY = e.nativeEvent.contentOffset.y;
								if (offsetY < -50) {
									fetchMessages();
								}
							}}
							onScroll={(e) => {
								const offsetY = e.nativeEvent.contentOffset.y;
								if (offsetY === 0) {
									readLatestMessage(threadData, userInfo);
								}
							}}
							scrollEventThrottle={0}
							onContentSizeChange={() => {
								scrollViewRef.current?.scrollToEnd();
							}}
							contentContainerStyle={tw('flex flex-col justify-end')}
						>
							<View style={tw('flex flex-1')}>
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
															.map((x) =>
																x.photoURL ? x.photoURL : undefined
															)}
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
							</View>
						</ScrollView>
					</View>
				</ScrollView>
			</Animated.View>
		</>
	);
};
export default Messages;
