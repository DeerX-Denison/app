import { UserContext } from '@Contexts';
import { fn, localTime } from '@firebase.config';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	useKeyboard,
	useKeyboardPadding,
	useLatestNonSelfMsg,
	useMessage,
	useMessageStatus,
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
	const { latestNonSelfMsg } = useLatestNonSelfMsg(threadData?.messages);
	renderHeader(navigation, threadData);
	const { parsedMessages } = useParseMessage(threadData?.messages);
	const [disableSend, setDisableSend] = useState<boolean>(false);
	const { seenIcons } = useSeenIcons(threadData);
	const { msgsWithSeenIconsIds } = useMsgWithSeenIconIds(seenIcons, threadData);
	const { msgWithStatusId } = useMsgWithStatusId(
		threadData,
		msgsWithSeenIconsIds
	);
	const { messageStatus, setMessageStatus } = useMessageStatus(
		threadData,
		msgWithStatusId
	);
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

	const { wishlist } = useWishlist(query);

	const [boxHeight, setBoxHeight] = useState(0);
	const [contentHeight, setContentHeight] = useState(0);
	const [scroll, setScroll] = useState(true);

	const sendHandler = async () => {
		setInputText('');
		setDisableSend(true);
		if (threadData && userInfo && message) {
			if (inputText !== '') {
				setMessageStatus('sending');
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { messages, ...threadPreviewData } = threadData;
				const newMessage: MessageData = {
					...message,
					time: localTime(),
					id: uuidv4(),
				};
				setThreadMessagesData([...threadData.messages, newMessage]);
				if (isNewThread) {
					try {
						await fn.httpsCallable('createThread')(threadPreviewData);
					} catch (error) {
						return logger.log(error);
					}
					setIsNewThread(false);
				}
				setDisableSend(false);
				try {
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
									{/* <Buttons.Primary
										title="Send"
										onPress={sendHandler}
										size="md"
										disabled={disableSend}
									/> */}
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
								{parsedMessages && parsedMessages.length > 0 && (
									// parsedMessages defined
									<>
										{parsedMessages.map((message) => (
											<Message
												key={message.id}
												message={message}
												latestNonSelfMsg={latestNonSelfMsg}
												msgsWithSeenIconsIds={msgsWithSeenIconsIds}
												msgWithStatusId={msgWithStatusId}
												messageStatus={messageStatus}
												nonSelfIcons={threadData?.members
													.filter((x) => x.uid !== userInfo?.uid)
													.map((x) => (x.photoURL ? x.photoURL : undefined))}
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
