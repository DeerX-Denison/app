import { DEFAULT_LATEST_MESSAGE } from '@Constants';
import { UserContext } from '@Contexts';
import { fn, localTime } from '@firebase.config';
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
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import 'react-native-get-random-values';
import { InputTextRef, MessageData, MessageStackParamList } from 'types';
import { v4 as uuidv4 } from 'uuid';
import SendActive from '../../../../static/send-active.svg';
import SendInactive from '../../../../static/send-inactive.svg';
import InputTextContent from './InputTextContent';
import ItemSuggestion from './ItemSuggestion';
import Message from './Message';
import onChangeTextHandler from './onChangeTextHandler';
import onSelectionChange from './onSelectionChange';
import readLatestMessage from './readLatestMessage';
import renderHeader from './renderHeader';
import useLatestSeenMsgId from './useLatestSeenMsgId';
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
	const { threadData, setNewMsgs, isNewThread, setIsNewThread, fetchMessages } =
		useThreadData(route.params.members);
	renderHeader(navigation, threadData);
	const { parsedMessages } = useParseMessage(threadData?.messages);
	const [disableSend, setDisableSend] = useState<boolean>(false);

	// state for showing menu. undefined means no menu. defined store string of
	// menu for the message id. Now suffix indicates instant render
	const [showingMenu, setShowingMenu] = useState<string | undefined>();
	const [showingMenuNow, setShowingMenuNow] = useState<string | undefined>();

	const { didShow } = useKeyboard();

	// height of the static box window that contains all messages
	const [boxHeight, setBoxHeight] = useState(0);
	// height of all the dynamic content of all messages
	const [contentHeight, setContentHeight] = useState(0);

	useScrollToEndOnKeyboard(didShow, scrollViewRef);
	const textInputRef = useRef<TextInput | undefined>();
	useEffect(() => {
		textInputRef.current?.focus();
	}, [textInputRef]);

	const { paddingBottom } = useKeyboardPadding();

	const {
		message,
		inputText,
		setInputText,
		showingItem,
		query,
		setTextSelection,
		textSelection,
		refs,
		setRefs,
		isWithinRef,
		insideRef,
	} = useMessage(threadData, setDisableSend);

	const { latestSeenMsgId } = useLatestSeenMsgId(threadData);
	const { wishlist } = useWishlist(query);
	// previous cursor begin and end index of inputText string
	const [prevSelector, setPrevSelector] = useState<{
		end: number;
		start: number;
	}>({ end: 0, start: 0 });

	// key user just pressed. initially empty string
	const [keyPressed, setKeyPressed] = useState<string>('');

	// state if user is extending cursor selection
	const [extendingSelection, setExtendingSelection] = useState<boolean>(false);

	// state storing cursor selection's ref selection
	const [withinWhichRef, setWithinWhichRef] = useState<InputTextRef[]>([]);

	const sendHandler = async () => {
		setInputText('');
		setDisableSend(true);
		if (threadData && userInfo && message) {
			if (inputText !== '') {
				setInputText('');
				setDisableSend(true);
				const newMessage: MessageData = {
					...message,
					time: localTime(),
					id: uuidv4(),
				};
				setNewMsgs([newMessage]);
				setTimeout(() => {
					scrollViewRef.current?.scrollToEnd({ animated: true });
				}, 0);
				setRefs([]);
				setDisableSend(false);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { messages, ...threadPreviewData } = threadData;
				if (isNewThread) {
					try {
						await fn.httpsCallable('createThread')(threadPreviewData);
					} catch (error) {
						return logger.error(error);
					}
					setIsNewThread(false);
				}

				try {
					await fn.httpsCallable('createMessage')({
						threadPreviewData,
						message: newMessage,
					});
				} catch (error) {
					logger.error(error);
				}
			}
		} else {
			// error handling
		}
		setTimeout(() => {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		}, 0);
	};

	// state for refresh control thread preview scroll view
	const [refreshing, setRefreshing] = useState(false);
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
					contentContainerStyle={tw(
						'flex flex-col-reverse flex-1 bg-light-pink'
					)}
					scrollEnabled={false}
					nestedScrollEnabled={true}
					keyboardShouldPersistTaps="always"
				>
					{/* TEXT MESSAGE INPUT */}
					<View style={tw('flex flex-col-reverse')}>
						<View
							style={tw(
								'py-2 flex-row border-t border-b border-gray-400 bg-gray'
							)}
						>
							<TextInput
								ref={textInputRef as any}
								placeholder="Enter a message"
								style={tw('flex-1 mx-4 text-s-lg py-2 max-h-32')}
								multiline={true}
								scrollEnabled={true}
								onChangeText={(text) =>
									onChangeTextHandler(
										text,
										refs,
										setRefs,
										keyPressed,
										isWithinRef,
										insideRef,
										extendingSelection,
										inputText,
										setInputText,
										prevSelector,
										textSelection,
										withinWhichRef
									)
								}
								selectTextOnFocus={true}
								// intentionally left out cuz onFocus => open keyboard => scroll to end => readLatestMessage
								// onFocus={() => readLatestMessage(threadData, userInfo)}
								autoCorrect={false}
								onSelectionChange={(e) =>
									onSelectionChange(
										e,
										prevSelector,
										setPrevSelector,
										textSelection,
										setTextSelection,
										refs,
										setWithinWhichRef,
										setExtendingSelection
									)
								}
								onKeyPress={(e) => {
									setKeyPressed(e.nativeEvent.key);
								}}
							>
								<InputTextContent refs={refs} inputText={inputText} />
							</TextInput>
							<View style={tw('flex-col justify-end')}>
								<View style={tw('pr-4 flex-1')}>
									{inputText ? (
										<TouchableOpacity
											onPress={sendHandler}
											disabled={disableSend}
										>
											<SendActive height={36} width={36} />
										</TouchableOpacity>
									) : (
										<TouchableOpacity
											onPress={sendHandler}
											disabled={disableSend}
										>
											<SendInactive height={36} width={36} />
										</TouchableOpacity>
									)}
								</View>
							</View>
						</View>
						{showingItem && (
							<ItemSuggestion
								query={query}
								wishlist={wishlist}
								inputText={inputText}
								textSelection={textSelection}
								setTextSelection={setTextSelection}
								refs={refs}
								setRefs={setRefs}
								setInputText={setInputText}
							/>
						)}
					</View>

					{/* MESSAGES CONTAINER */}
					<View
						style={tw('flex-col-reverse pt-4 h-full')}
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
							onMomentumScrollEnd={(e) => {
								// if user scroll to bottom
								if (
									Math.abs(
										e.nativeEvent.contentOffset.y -
											(e.nativeEvent.contentSize.height - boxHeight)
									) < 30
								) {
									readLatestMessage(threadData, userInfo);
								}
							}}
							scrollEventThrottle={0}
							contentContainerStyle={{
								paddingTop:
									contentHeight < boxHeight
										? boxHeight - contentHeight - 15
										: 55,
							}}
						>
							<TouchableWithoutFeedback
								onPress={() => {
									setShowingMenuNow(undefined);
									setTimeout(() => {
										setShowingMenu(undefined);
									}, 500);
								}}
							>
								<View
									onLayout={(event) => {
										const { height } = event.nativeEvent.layout;
										setContentHeight(height);
									}}
								>
									{!parsedMessages && <Text>Loading...</Text>}
									{parsedMessages && parsedMessages.length === 0 && (
										<View
											style={tw('flex flex-1 justify-center items-center p-4')}
										>
											<Text style={tw('text-s-lg font-semibold')}>
												{DEFAULT_LATEST_MESSAGE}
											</Text>
										</View>
									)}
									{parsedMessages &&
										parsedMessages.length === 1 &&
										isNewThread === true && (
											<View
												style={tw('flex flex-1 justify-center items-center')}
											>
												<Text style={tw('text-s-lg')}>
													Sending your first message...
												</Text>
											</View>
										)}
									{parsedMessages &&
										threadData &&
										parsedMessages.length > 0 &&
										parsedMessages.map((message) => (
											<Message
												navigation={navigation}
												route={route}
												key={message.id}
												message={message}
												threadId={threadData.id}
												members={threadData.members}
												latestSeenMsgId={latestSeenMsgId}
												showingMenu={showingMenu}
												setShowingMenu={setShowingMenu}
												showingMenuNow={showingMenuNow}
												setShowingMenuNow={setShowingMenuNow}
											/>
										))}
								</View>
							</TouchableWithoutFeedback>
						</ScrollView>
					</View>
				</ScrollView>
			</Animated.View>
		</>
	);
};
export default Messages;
