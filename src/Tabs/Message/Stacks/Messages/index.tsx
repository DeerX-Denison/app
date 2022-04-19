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
import { Ref } from 'src/Hooks/useMessage/useInputText';
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
	} = useMessage(threadData);

	const { wishlist } = useWishlist(query);

	const [boxHeight, setBoxHeight] = useState(0);
	const [contentHeight, setContentHeight] = useState(0);
	const [scroll, setScroll] = useState(true);

	const [prevSelector, setPrevSelector] = useState<
		{ end: number; start: number } | undefined
	>({ end: 0, start: 0 });

	const [extendingSelection, setExtendingSelection] = useState<boolean>(false);
	const [withinWhichRef, setWithinWhichRef] = useState<Ref[]>([]);

	const sendHandler = async () => {
		setInputText('');
		setRefs([]);
		setDisableSend(true);
		if (threadData && userInfo && message) {
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
				const newMessage: MessageData = {
					...message,
					time: localTime(),
					id: uuidv4(),
				};
				setThreadMessagesData([...threadData.messages, newMessage]);
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
									let exist = false;
									for (let i = 0; i < refs.length; i++) {
										if (
											prevSelector?.start >= refs[i].begin + 1 &&
											prevSelector?.start <= refs[i].end + 1
										) {
											exist = true;
										}
									}
									if (
										keyPressed === 'Backspace' &&
										isWithinRef.isWithinRef &&
										exist &&
										!extendingSelection
									) {
										const start = isWithinRef.whichRef?.begin;
										const end = isWithinRef.whichRef?.end + 1;
										const _ = refs.indexOf(isWithinRef.whichRef);
										if (_ > -1) {
											const first = inputText.slice(0, start);
											const second = inputText.slice(end, inputText.length);
											setInputText(first + second);
											refs.splice(_, 1);
											const deletedRef =
												isWithinRef.whichRef?.end -
												isWithinRef.whichRef?.begin +
												1;
											for (let i = 0; i < refs.length; i++) {
												if (refs[i].begin > isWithinRef.whichRef?.end) {
													refs[i].begin -= deletedRef;
													refs[i].end -= deletedRef;
												}
											}
											setRefs(refs);
										}
									} else {
										setInputText(text);
										if (text.length < inputText.length) {
											if (!extendingSelection && keyPressed === 'Backspace') {
												for (let i = 0; i < refs.length; i++) {
													if (refs[i].begin >= prevSelector?.start - 1) {
														refs[i].begin -= 1;
														refs[i].end -= 1;
													}
												}
											} else {
												for (let i = 0; i < refs.length; i++) {
													if (refs[i].begin >= prevSelector?.end - 1) {
														refs[i].begin -= inputText.length - text.length;
														refs[i].end -= inputText.length - text.length;
													}
												}
												for (let i = 0; i < withinWhichRef.length; i++) {
													const _ = refs.indexOf(withinWhichRef[i]);
													if (_ > -1) {
														refs.splice(_, 1);
													}
												}
												setRefs(refs);
											}
										} else if (text.length > inputText.length) {
											if (!extendingSelection) {
												for (let i = 0; i < refs.length; i++) {
													if (refs[i].begin >= prevSelector?.start - 1) {
														refs[i].begin += text.length - inputText.length;
														refs[i].end += text.length - inputText.length;
													}
												}
											}
										}
									}
								}}
								selectTextOnFocus={true}
								// onFocus={() => readLatestMessage(threadData, userInfo)}
								autoCorrect={false}
								onSelectionChange={(e) => {
									setPrevSelector(textSelection);
									setTextSelection(e.nativeEvent.selection);
									const arr: Ref[] = [];
									for (let i = 0; i < refs.length; i++) {
										if (
											(refs[i].begin <= textSelection?.start - 1 &&
												refs[i].end >= textSelection?.start) ||
											(refs[i].begin <= textSelection?.end - 1 &&
												refs[i].end >= textSelection?.end)
										) {
											arr.push(refs[i]);
										}
									}
									setWithinWhichRef(arr);
									if (prevSelector?.start !== prevSelector?.end) {
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
														<>
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
														</>
													);
													// eslint-disable-next-line no-mixed-spaces-and-tabs
											  })
											: refs.map((item, index) => {
													if (index === refs.length - 1) {
														return (
															<>
																<Text key={uuidv4()}>
																	{inputText.slice(
																		refs[index - 1].end + 1,
																		refs[index].begin
																	)}
																</Text>
																<Text style={tw('font-bold')} key={uuidv4()}>
																	{inputText.slice(
																		refs[index].begin,
																		refs[index].end + 1
																	)}
																</Text>
																<Text key={uuidv4()}>
																	{inputText.slice(refs[index].end + 1)}
																</Text>
															</>
														);
													} else if (index === 0) {
														return (
															<>
																<Text key={uuidv4()}>
																	{inputText.slice(0, refs[index].begin)}
																</Text>
																<Text style={tw('font-bold')} key={uuidv4()}>
																	{inputText.slice(
																		refs[index].begin,
																		refs[index].end + 1
																	)}
																</Text>
															</>
														);
													} else {
														return (
															<>
																<Text key={uuidv4()}>
																	{inputText.slice(
																		refs[index - 1].end + 1,
																		refs[index].begin
																	)}
																</Text>
																<Text style={tw('font-bold')} key={uuidv4()}>
																	{inputText.slice(
																		refs[index].begin,
																		refs[index].end + 1
																	)}
																</Text>
															</>
														);
													}
													// eslint-disable-next-line no-mixed-spaces-and-tabs
											  })
										: inputText}
								</Text>
							</TextInput>
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
						style={tw('flex-col-reverse mt-14 h-full')}
						onLayout={(event) => {
							const { height } = event.nativeEvent.layout;
							setBoxHeight(height);
						}}
					>
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
