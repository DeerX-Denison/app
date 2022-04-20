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
import { Ref } from 'src/Hooks/useMessage/useInputText';
import { MessageData, MessageStackParamList } from 'types';
import { v4 as uuidv4 } from 'uuid';
import ItemSuggestion from './ItemSuggestion';
import Message from './Message';
import readLatestMessage from './readLatestMessage';
import renderHeader from './renderHeader';
import useLatestSeenMsgId from './useLatestSeenMsgId';
import useScrollToEndOnKeyboard from './useScrollToEndOnKeyboard';
import useScrollToEndOnOpen from './useScrollToEndOnOpen';

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

	const { didShow } = useKeyboard();

	// height of the static box window that contains all messages
	const [boxHeight, setBoxHeight] = useState(0);
	// height of all the dynamic content of all messages
	const [contentHeight, setContentHeight] = useState(0);

	useScrollToEndOnOpen(scrollViewRef, threadData);
	useScrollToEndOnKeyboard(didShow, scrollViewRef);

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
		keyPressed,
		setKeyPressed,
		isWithinRef,
	} = useMessage(threadData, setDisableSend);

	const { latestSeenMsgId } = useLatestSeenMsgId(threadData);
	const { wishlist } = useWishlist(query);

	// previous cursor begin and end index of inputText string
	const [prevSelector, setPrevSelector] = useState<{
		end: number;
		start: number;
	}>({ end: 0, start: 0 });

	const [extendingSelection, setExtendingSelection] = useState<boolean>(false);
	const [withinWhichRef, setWithinWhichRef] = useState<Ref[]>([]);

	const sendHandler = async () => {
		setInputText('');
		setRefs([]);
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
		scrollViewRef.current?.scrollToEnd({ animated: true });
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
								placeholder="Enter a message"
								style={tw('flex-1 mx-4 text-s-lg py-2 max-h-32')}
								multiline={true}
								scrollEnabled={true}
								onChangeText={(text) => {
									const mutableRefs = refs.map((x) => x);
									// check if deleteing a refs, stick begin of ref to end of ref
									if (
										keyPressed === 'Backspace' &&
										isWithinRef &&
										isWithinRef.isWithinRef &&
										isWithinRef.whichRef &&
										!extendingSelection
									) {
										const start = isWithinRef.whichRef.begin;
										const end = isWithinRef.whichRef.end + 1;
										const _ = refs.indexOf(isWithinRef.whichRef);
										if (_ > -1) {
											const first = inputText.slice(0, start);
											const second = inputText.slice(end, inputText.length);
											setInputText(first + second);
											mutableRefs.splice(_, 1);
											const deletedRef =
												isWithinRef.whichRef?.end -
												isWithinRef.whichRef?.begin +
												1;
											for (let i = 0; i < mutableRefs.length; i++) {
												if (mutableRefs[i].begin > isWithinRef.whichRef?.end) {
													mutableRefs[i].begin -= deletedRef;
													mutableRefs[i].end -= deletedRef;
												}
											}
											setRefs(mutableRefs);
										}
									} else {
										setInputText(text);
										if (text.length < inputText.length) {
											if (!extendingSelection && keyPressed === 'Backspace') {
												for (let i = 0; i < mutableRefs.length; i++) {
													if (mutableRefs[i].begin >= prevSelector?.start - 1) {
														mutableRefs[i].begin -= 1;
														mutableRefs[i].end -= 1;
													}
												}
											} else {
												for (let i = 0; i < mutableRefs.length; i++) {
													if (mutableRefs[i].begin >= prevSelector.end - 1) {
														mutableRefs[i].begin -=
															inputText.length - text.length;
														mutableRefs[i].end -=
															inputText.length - text.length;
													}
												}
												for (let i = 0; i < withinWhichRef.length; i++) {
													const _ = mutableRefs.indexOf(withinWhichRef[i]);
													if (_ > -1) {
														mutableRefs.splice(_, 1);
													}
												}
											}
										} else if (text.length > inputText.length) {
											if (!extendingSelection) {
												for (let i = 0; i < mutableRefs.length; i++) {
													if (mutableRefs[i].begin >= prevSelector?.start - 1) {
														mutableRefs[i].begin +=
															text.length - inputText.length;
														mutableRefs[i].end +=
															text.length - inputText.length;
													}
												}
											}
										}
										setRefs(mutableRefs);
									}
								}}
								selectTextOnFocus={true}
								// intentionally left out cuz onFocus => open keyboard => scroll to end => readLatestMessage
								// onFocus={() => readLatestMessage(threadData, userInfo)}
								autoCorrect={false}
								onSelectionChange={(e) => {
									setPrevSelector(textSelection);
									setTextSelection(e.nativeEvent.selection);
									const arr: Ref[] = [];
									for (let i = 0; i < refs.length; i++) {
										if (
											(refs[i].begin <= textSelection.start - 1 &&
												refs[i].end >= textSelection.start) ||
											(refs[i].begin <= textSelection.end - 1 &&
												refs[i].end >= textSelection.end)
										) {
											arr.push(refs[i]);
										}
									}
									setWithinWhichRef(arr);
									if (prevSelector.start !== prevSelector?.end) {
										setExtendingSelection(true);
									} else {
										setExtendingSelection(false);
									}
								}}
								onKeyPress={(e) => {
									setKeyPressed(e.nativeEvent.key);
								}}
							>
								<Text>
									{refs.length > 0
										? refs.length === 1
											? refs.map((item, index) => {
													return (
														<Text key={uuidv4()}>
															<Text>
																{inputText.slice(0, refs[index].begin)}
															</Text>
															<Text style={tw('font-bold')}>
																{inputText.slice(
																	refs[index].begin,
																	refs[index].end + 1
																)}
															</Text>
															<Text>
																{inputText.slice(refs[index].end + 1)}
															</Text>
														</Text>
													);
													// eslint-disable-next-line no-mixed-spaces-and-tabs
											  })
											: refs.map((item, index) => {
													if (index === refs.length - 1) {
														return (
															<Text key={uuidv4()}>
																<Text>
																	{inputText.slice(
																		refs[index - 1].end + 1,
																		refs[index].begin
																	)}
																</Text>
																<Text style={tw('font-bold')}>
																	{inputText.slice(
																		refs[index].begin,
																		refs[index].end + 1
																	)}
																</Text>
																<Text>
																	{inputText.slice(refs[index].end + 1)}
																</Text>
															</Text>
														);
													} else if (index === 0) {
														return (
															<Text key={uuidv4()}>
																<Text>
																	{inputText.slice(0, refs[index].begin)}
																</Text>
																<Text style={tw('font-bold')}>
																	{inputText.slice(
																		refs[index].begin,
																		refs[index].end + 1
																	)}
																</Text>
															</Text>
														);
													} else {
														return (
															<Text key={uuidv4()}>
																<Text>
																	{inputText.slice(
																		refs[index - 1].end + 1,
																		refs[index].begin
																	)}
																</Text>
																<Text style={tw('font-bold')}>
																	{inputText.slice(
																		refs[index].begin,
																		refs[index].end + 1
																	)}
																</Text>
															</Text>
														);
													}
													// eslint-disable-next-line no-mixed-spaces-and-tabs
											  })
										: inputText}
								</Text>
								{/* <Text>
									{[...inputText].map((char, index) => {
										return <Text key={index}>{char}</Text>;
									})}
								</Text> */}
							</TextInput>
							<View style={tw('flex-col justify-end')}>
								<View style={tw('pr-4')}>
									{inputText ? (
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
									) : (
										<TouchableOpacity
											onPress={sendHandler}
											disabled={disableSend}
										>
											<FontAwesomeIcon
												icon={faCircleArrowUp}
												size={25}
												style={tw('bottom-2', 'text-gray-500', 'text-s-sm')}
											/>
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
							onScroll={(e) => {
								// if user scroll to bottom
								if (
									Math.ceil(e.nativeEvent.contentOffset.y) ===
									Math.ceil(e.nativeEvent.contentSize.height - boxHeight)
								) {
									readLatestMessage(threadData, userInfo);
								}
							}}
							scrollEventThrottle={0}
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
								{!parsedMessages && <Text>Loading...</Text>}
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
								{parsedMessages &&
									parsedMessages.length > 0 &&
									parsedMessages.map((message) => (
										<Message
											key={message.id}
											message={message}
											members={threadData?.members}
											latestSeenMsgId={latestSeenMsgId}
										/>
									))}
							</View>
						</ScrollView>
					</View>
				</ScrollView>
			</Animated.View>
		</>
	);
};
export default Messages;
