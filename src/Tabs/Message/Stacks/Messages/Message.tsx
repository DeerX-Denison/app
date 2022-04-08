import { DEFAULT_MESSAGE_THUMBNAIL } from '@Constants';
import { UserContext } from '@Contexts';
import { faCheckCircle as regularCheckIcon } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as solidCheckIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import tw from '@tw';
import React, { FC, useContext } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import 'react-native-get-random-values';
import { MessageBlockData } from 'types';

interface Props {
	message: MessageBlockData;
	msgsWithSeenIconsIds: string[] | undefined;
	msgWithStatusId: string | undefined;
	messageStatus: undefined | 'sending' | 'sent' | 'seen';
	nonSelfIcons: (string | undefined)[] | undefined;
}

/**
 * Message component, Threads contains Thread contains Messages contains Message
 */
const Message: FC<Props> = ({
	message,
	msgsWithSeenIconsIds,
	msgWithStatusId,
	messageStatus,
	nonSelfIcons,
}) => {
	const { userInfo } = useContext(UserContext);
	// const { curTime } = useCurrentTime();
	// const { displayTime } = useMessageDisplayTime(message.time.toDate(), curTime);
	return (
		<>
			<View style={tw('p-1 flex-row items-end')}>
				<View style={tw('flex-1')}>
					<View style={tw('flex-col')}>
						{/* <View style={tw('flex-row justify-start items-end')}>
							<Text style={tw('text-s-lg font-normal pr-4 text-gray-600')}>
								{message.sender.displayName}
							</Text>
							<Text style={tw('text-s-md font-normal text-gray-600')}>
								{displayTime}
							</Text>
						</View> */}
						{userInfo && (
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
												<View
													style={{
														...tw('rounded-xl px-3 py-2 mb-0.5 bg-red-300'),
														maxWidth: '80%',
													}}
												>
													<Text style={tw('text-s-md')}>{content.content}</Text>
												</View>
												<View style={tw('flex flex-row w-4 mb-0.5 ml-1')}>
													{msgsWithSeenIconsIds?.includes(content.id) ? (
														<>
															{nonSelfIcons?.map((iconUrl) => (
																<View key={iconUrl}>
																	<FastImage
																		source={{ uri: iconUrl }}
																		style={tw('h-4 w-4 rounded-full')}
																	/>
																</View>
															))}
														</>
													) : (
														<>
															{content.id === msgWithStatusId && (
																<>
																	{messageStatus === 'sending' && (
																		<FontAwesomeIcon
																			icon={regularCheckIcon}
																			style={tw('h-4 w-4 text-red-500')}
																		/>
																	)}
																	{messageStatus === 'sent' && (
																		<FontAwesomeIcon
																			icon={solidCheckIcon}
																			style={tw('h-4 w-4 text-red-500')}
																		/>
																	)}
																</>
															)}
														</>
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
													style={tw('flex flex-row justify-between items-end')}
												>
													<View
														style={{
															...tw('rounded-xl px-3 py-2 mb-0.5 bg-red-300'),
															maxWidth: '80%',
														}}
													>
														<Text style={tw('text-s-md')}>
															{content.content}
														</Text>
													</View>
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
