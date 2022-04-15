import { UserContext } from '@Contexts';
import { fn, localTime } from '@firebase.config';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	useKeyboard,
	useKeyboardPadding,
	useMessage,
	useParseMessage,
	useThreadData,
	useWishlist,
} from '@Hooks';
import logger from '@logger';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import {
	Animated,
	RefreshControl,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { TextSelection } from 'src/Hooks/useMessage/useInputText';
import { MessageData, MessageStackParamList } from 'types';
import { v4 as uuidv4 } from 'uuid';
import ItemSuggestion from './ItemSuggestion';
import Message from './Message';
import readLatestMessage from './readLatestMessage';
import renderHeader from './renderHeader';
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

	const { didShow } = useKeyboard();
	useScrollToEndOnKeyboard(didShow, scrollViewRef);
	const { paddingBottom } = useKeyboardPadding();

	const {
		message,
		inputText,
		setInputText,
		showingItem,
		query,
		setTextSelection,
	} = useMessage(threadData);

	// latest seen message id custom hook
	const [latestSeenMsgId, setSeenMsgId] = useState<string | undefined>();
	useEffect(() => {
		if (threadData) {
			const seenMsgs = threadData.messages.filter((x) => {
				let seen = true;
				if ('seenAt' in x) {
					threadData.membersUid.forEach((uid) => {
						if (x.seenAt[uid] === null) seen = false;
					});
				}
				return seen;
			});
			if (seenMsgs.length > 0) {
				const latestSeenMsg = seenMsgs[seenMsgs.length - 1];
				setSeenMsgId(latestSeenMsg.id);
			}
		}
	}, [threadData]);

	const { wishlist } = useWishlist(query);

	const [boxHeight, setBoxHeight] = useState(0);
	const [contentHeight, setContentHeight] = useState(0);
	const [scroll, setScroll] = useState(true);

	const sendHandler = async () => {
		setInputText('');
		setDisableSend(true);
		if (threadData && userInfo && message) {
			if (inputText !== '') {
				const newMessage: MessageData = {
					...message,
					time: localTime(),
					id: uuidv4(),
				};
				setThreadMessagesData([...threadData.messages, newMessage]);
				setDisableSend(false);
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
					await fn.httpsCallable('createMessage')({
						threadPreviewData,
						message: newMessage,
					});
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

	// state for refresh control thread preview scroll view
	const [refreshing, setRefreshing] = React.useState(false);
	const onRefresh = async () => {
		setRefreshing(true);
		await fetchMessages();
		setRefreshing(false);
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
								onSelectionChange={(e) =>
									setTextSelection(e.nativeEvent.selection as TextSelection)
								}
							/>
							<View style={tw('flex-col justify-end')}>
								<View style={tw('pr-4')}>
									<TouchableOpacity
										onPress={sendHandler}
										disabled={disableSend}
									>
										<FontAwesomeIcon
											icon={faCircleArrowUp}
											size={25}
											style={tw('bottom-2', 'text-blue-500', 'text-s-sm')}
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
						{showingItem && (
							<ItemSuggestion query={query} wishlist={wishlist} />
						)}
					</View>

					{/* MESSAGES CONTAINER */}
					<View
						style={tw('flex-col-reverse mt-14 h-full')}
						onLayout={(event) => {
							const { height } = event.nativeEvent.layout;
							setBoxHeight(height);
						}}
					>
						<ScrollView
							refreshControl={
								<RefreshControl
									refreshing={refreshing}
									onRefresh={onRefresh}
									progressViewOffset={
										contentHeight < boxHeight ? boxHeight - contentHeight : 55
									}
									size={24}
								/>
							}
							showsVerticalScrollIndicator={false}
							showsHorizontalScrollIndicator={false}
							ref={scrollViewRef as any}
							onScroll={(e) => {
								const offsetY = e.nativeEvent.contentOffset.y;
								if (offsetY === 0) {
									setScroll(false);
									readLatestMessage(threadData, userInfo);
								}
							}}
							scrollEventThrottle={0}
							onContentSizeChange={() => {
								if (scroll) {
									scrollViewRef.current?.scrollToEnd();
								}
							}}
							contentContainerStyle={{
								paddingTop:
									contentHeight < boxHeight ? boxHeight - contentHeight : 55,
							}}
						>
							<View
								onLayout={(event) => {
									const { height } = event.nativeEvent.layout;
									setContentHeight(height);
								}}
							>
								{!parsedMessages && (
									<>
										<Text>Loading...</Text>
									</>
								)}
								{parsedMessages && parsedMessages.length === 0 && (
									<View style={tw('flex flex-1 justify-center items-center')}>
										<Text style={tw('text-s-lg')}>Send your first message</Text>
									</View>
								)}
								{parsedMessages &&
									parsedMessages.length === 1 &&
									isNewThread === true && (
										<View style={tw('flex flex-1 justify-center items-center')}>
											<Text style={tw('text-s-lg')}>
												Sending your first message...
											</Text>
										</View>
									)}
								{parsedMessages && parsedMessages.length > 0 && (
									// parsedMessages defined
									<>
										{parsedMessages.map((message) => (
											<Message
												key={message.id}
												message={message}
												members={threadData?.members}
												latestSeenMsgId={latestSeenMsgId}
											/>
										))}
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
