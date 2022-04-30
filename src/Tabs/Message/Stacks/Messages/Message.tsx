import {
	DEFAULT_MESSAGE_THUMBNAIL,
	DENISON_RED_RGBA,
	MESSAGE_MENU_ANIM_TIME,
} from '@Constants';
import { UserContext } from '@Contexts';
import { faCheckCircle as regularCheckIcon } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as solidCheckIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	useCurrentTime,
	useMessageDisplayTime,
	useMessageMenuScale,
} from '@Hooks';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext, useEffect, useState } from 'react';
import {
	Animated,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import 'react-native-get-random-values';
import { MessageBlockData, MessageStackParamList, UserInfo } from 'types';
import MessageMenu from './LongPressMenu';
import TextContent from './TextContent';

interface Props {
	navigation: NativeStackNavigationProp<MessageStackParamList>;
	route: RouteProp<MessageStackParamList, 'Messages'>;
	message: MessageBlockData;
	members: UserInfo[] | undefined;
	latestSeenMsgId: string | undefined;
	showingMenu: string | undefined;
	setShowingMenu: React.Dispatch<React.SetStateAction<string | undefined>>;
	showingMenuNow: string | undefined;
	setShowingMenuNow: React.Dispatch<React.SetStateAction<string | undefined>>;
}

/**
 * Message component, Threads contains Thread contains Messages contains Message
 */
const Message: FC<Props> = ({
	navigation,
	message,
	members,
	latestSeenMsgId,
	showingMenu,
	setShowingMenu,
	showingMenuNow,
	setShowingMenuNow,
}) => {
	const { userInfo } = useContext(UserContext);
	const [nonSelfUid, setNonSelfUid] = useState<string | undefined>();
	const [nonSelfIcon, setNonSelfIcon] = useState<string | undefined>();
	const { curTime } = useCurrentTime();
	const { displayTime } = useMessageDisplayTime(message.time.toDate(), curTime);
	const { scale } = useMessageMenuScale(showingMenuNow);
	useEffect(() => {
		if (userInfo && members && members.length > 0) {
			const nonSelf = members.filter((member) => member.uid !== userInfo.uid);
			const nonSelfUids = nonSelf.map((x) => x.uid);
			if (nonSelfUids.length === 1) {
				setNonSelfUid(nonSelfUids[0]);
			} else {
				setNonSelfUid(userInfo.uid);
			}

			const nonSelfIcon = nonSelf.map((x) => x.photoURL);
			if (nonSelfIcon.length === 1) {
				setNonSelfIcon(
					nonSelfIcon[0] ? nonSelfIcon[0] : DEFAULT_MESSAGE_THUMBNAIL
				);
			} else {
				setNonSelfIcon(
					userInfo.photoURL ? userInfo.photoURL : DEFAULT_MESSAGE_THUMBNAIL
				);
			}
		}
	}, [userInfo, members]);

	return (
		<>
			<View style={tw('p-1 flex-row items-end')}>
				<View style={tw('flex-1')}>
					<View style={tw('flex-col')}>
						<View style={tw('justify-center items-center pb-1 pt-2')}>
							<Text style={tw('text-s-sm font-light')}>{displayTime}</Text>
						</View>
						{userInfo && nonSelfUid && (
							// user is logged in, proceed to determine if message is self or other
							<>
								{message.sender.uid === userInfo.uid ? (
									// the message is from self, render self bubbles
									<View style={tw('flex flex-col items-end')}>
										{message.contents.map((content) => (
											<View
												key={content.id}
												style={tw('flex flex-row justify-between items-end')}
											>
												<TouchableWithoutFeedback
													onPress={() => {
														setShowingMenuNow(undefined);
														setTimeout(() => {
															setShowingMenu(undefined);
														}, MESSAGE_MENU_ANIM_TIME);
													}}
													onLongPress={() => {
														setShowingMenuNow(content.id);
														setShowingMenu(content.id);
													}}
												>
													<View
														style={{
															...tw(
																'rounded-xl flex-col p-2 mb-0.5 bg-red-300'
															),
															maxWidth: '80%',
															shadowColor: DENISON_RED_RGBA,
															shadowOffset: { height: 2.5, width: 1 },
															shadowOpacity: 0.35,
															shadowRadius: 0.5,
														}}
													>
														<TextContent content={content} />
														{content.contentType.includes('reference') &&
															'refs' in content &&
															content.refs.length > 0 && (
																<View
																	style={{
																		...tw(
																			'rounded-xl mt-2 flex flex-row flex-wrap'
																		),
																		shadowColor: DENISON_RED_RGBA,
																		shadowOffset: { width: 2, height: 2 },
																		shadowOpacity: 0.25,
																		shadowRadius: 4,
																	}}
																>
																	{[
																		...new Set(
																			content.refs.map((x) => {
																				if ('data' in x && 'id' in x.data)
																					return x.data.id;
																				else return undefined;
																			})
																		),
																	]
																		.filter((x) => x !== undefined)
																		.map(
																			(uniqueId) =>
																				content.refs.filter(
																					(ref) => ref.data.id === uniqueId
																				)[0]
																		)
																		.map(({ data: wishlist }) => (
																			<View key={wishlist.id}>
																				<TouchableOpacity
																					onPress={() =>
																						navigation.navigate('Item', {
																							listingId: wishlist.id,
																						})
																					}
																				>
																					<FastImage
																						source={{ uri: wishlist.thumbnail }}
																						style={{
																							...tw('rounded-xl m-0.5'),
																							height: 90,
																							width: 90,
																						}}
																					/>
																				</TouchableOpacity>
																			</View>
																		))}
																</View>
															)}
													</View>
												</TouchableWithoutFeedback>

												<View style={tw('flex flex-row w-4 mb-0.5 ml-1')}>
													{content.seenAt[userInfo.uid] === null && (
														<FontAwesomeIcon
															icon={regularCheckIcon}
															style={tw('h-4 w-4 text-red-500')}
														/>
													)}
													{content.seenAt[userInfo.uid] !== null &&
														content.seenAt[nonSelfUid] === null && (
															<FontAwesomeIcon
																icon={solidCheckIcon}
																style={tw('h-4 w-4 text-red-500')}
															/>
														)}
													{content.seenAt[userInfo.uid] !== null &&
														content.seenAt[nonSelfUid] !== null &&
														content.id === latestSeenMsgId && (
															<FastImage
																source={{ uri: nonSelfIcon }}
																style={tw('h-4 w-4 rounded-full')}
															/>
														)}
												</View>
											</View>
										))}
									</View>
								) : (
									// the message is from other, render other bubbles
									<View style={tw('flex flex-row')}>
										<View style={tw('flex flex-col justify-end pr-1')}>
											<FastImage
												source={{
													uri: message.sender.photoURL
														? message.sender.photoURL
														: DEFAULT_MESSAGE_THUMBNAIL,
												}}
												style={tw('w-8 h-8 rounded-full')}
											/>
										</View>
										<View style={tw('flex flex-col flex-1 items-start')}>
											{message.contents.map((content) => (
												<View
													key={content.id}
													style={tw('flex justify-between items-end')}
												>
													<TouchableWithoutFeedback
														onPress={() => {
															setShowingMenuNow(undefined);
															setTimeout(() => {
																setShowingMenu(undefined);
															}, MESSAGE_MENU_ANIM_TIME);
														}}
														onLongPress={() => {
															setShowingMenuNow(content.id);
															setShowingMenu(content.id);
														}}
													>
														<View
															style={{
																...tw(
																	'rounded-xl flex-col p-2 mb-0.5 bg-red-300'
																),
																maxWidth: '80%',
																shadowColor: DENISON_RED_RGBA,
																shadowOffset: { height: 2.5, width: 1 },
																shadowOpacity: 0.35,
																shadowRadius: 0.5,
															}}
														>
															{content.id === showingMenu && (
																<Animated.View
																	style={{
																		transform: [{ scale }],
																	}}
																>
																	<MessageMenu
																		messageId={content.id}
																		setShowingMenu={setShowingMenu}
																		setShowingMenuNow={setShowingMenuNow}
																		navigation={navigation}
																	/>
																</Animated.View>
															)}
															<TextContent content={content} />
															{content.contentType.includes('reference') &&
																'refs' in content &&
																content.refs.length > 0 && (
																	<View
																		style={{
																			...tw(
																				'rounded-xl mt-2 flex flex-row flex-wrap'
																			),
																			shadowColor: DENISON_RED_RGBA,
																			shadowOffset: { width: 2, height: 2 },
																			shadowOpacity: 0.25,
																			shadowRadius: 4,
																		}}
																	>
																		{[
																			...new Set(
																				content.refs.map((x) => {
																					if ('data' in x && 'id' in x.data)
																						return x.data.id;
																					else return undefined;
																				})
																			),
																		]
																			.filter((x) => x !== undefined)
																			.map(
																				(uniqueId) =>
																					content.refs.filter(
																						(ref) => ref.data.id === uniqueId
																					)[0]
																			)
																			.map(({ data: wishlist }) => (
																				<View key={wishlist.id}>
																					<TouchableOpacity
																						onPress={() =>
																							navigation.navigate('Item', {
																								listingId: wishlist.id,
																							})
																						}
																					>
																						<FastImage
																							source={{
																								uri: wishlist.thumbnail,
																							}}
																							style={{
																								...tw('rounded-xl m-0.5'),
																								height: 90,
																								width: 90,
																							}}
																						/>
																					</TouchableOpacity>
																				</View>
																			))}
																	</View>
																)}
														</View>
													</TouchableWithoutFeedback>
												</View>
											))}
										</View>
									</View>
								)}
							</>
						)}
					</View>
				</View>
			</View>
		</>
	);
};

export default Message;
