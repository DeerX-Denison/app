import { DEFAULT_MESSAGE_THUMBNAIL } from '@Constants';
import { UserContext } from '@Contexts';
import { faCheckCircle as regularCheckIcon } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle as solidCheckIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useCurrentTime, useMessageDisplayTime } from '@Hooks';
import tw from '@tw';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import 'react-native-get-random-values';
import { MessageBlockData, UserInfo } from 'types';
interface Props {
	message: MessageBlockData;
	members: UserInfo[] | undefined;
	latestSeenMsgId: string | undefined;
}

/**
 * Message component, Threads contains Thread contains Messages contains Message
 */
const Message: FC<Props> = ({ message, members, latestSeenMsgId }) => {
	const { userInfo } = useContext(UserContext);
	const [nonSelfUid, setNonSelfUid] = useState<string | undefined>();
	const [nonSelfIcon, setNonSelfIcon] = useState<string | undefined>();
	const { curTime } = useCurrentTime();
	const { displayTime } = useMessageDisplayTime(message.time.toDate(), curTime);
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
												<View
													style={{
														...tw('rounded-xl px-3 py-2 mb-0.5 bg-red-300'),
														maxWidth: '80%',
													}}
												>
													<Text style={tw('text-s-md')}>{content.content}</Text>
												</View>
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
