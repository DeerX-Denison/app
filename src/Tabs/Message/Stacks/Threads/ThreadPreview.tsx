import { DENISON_RED_RGBA } from '@Constants';
import { UserContext } from '@Contexts';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	useCurrentTime,
	useHasSeenPreview,
	useIsSelfMsgPreview,
	useThreadPreviewDisplayMessage,
	useThreadPreviewDisplayTime,
} from '@Hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC, useContext } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { MessageStackParamList, ThreadPreviewData } from 'types';
interface Prop {
	threadPreviewData: ThreadPreviewData;
	navigation: NativeStackNavigationProp<MessageStackParamList>;
}

/**
 * Thread component, Threads contains Thread contains Messages contains Message
 */
const ThreadPreview: FC<Prop> = ({ threadPreviewData, navigation }) => {
	const { userInfo } = useContext(UserContext);
	const { hasSeen } = useHasSeenPreview(threadPreviewData);
	const { isSelfMsgPreview } = useIsSelfMsgPreview(threadPreviewData);

	if (!userInfo) {
		navigation.navigate('Threads');
		throw 'User unauthenticated';
	}
	const viewThreadHandler = () => {
		navigation.navigate('Messages', { members: threadPreviewData.members });
	};
	const { curTime } = useCurrentTime();

	const { displayTime } = useThreadPreviewDisplayTime(
		threadPreviewData.latestTime
			? threadPreviewData.latestTime.toDate()
			: undefined,
		curTime
	);

	const { displayMessage } = useThreadPreviewDisplayMessage(
		threadPreviewData.latestMessage
	);

	return (
		<>
			<TouchableWithoutFeedback onPress={viewThreadHandler}>
				<View
					style={tw(
						'flex flex-row items-start m-1 p-2 h-20 bg-white border-b border-gray-200'
					)}
				>
					<View
						// width must match height of the parent View. Currently 16
						// last updated Jan 14, 2022
						style={{
							...tw('h-full w-16 flex justify-center items-center'),
							shadowColor: DENISON_RED_RGBA,
							shadowOffset: { width: 1, height: 2 },
							shadowOpacity: 0.25,
							shadowRadius: 4,
						}}
					>
						<FastImage
							source={{
								uri: threadPreviewData.thumbnail[userInfo.uid],
							}}
							style={tw('h-full w-full rounded-full')}
						/>
					</View>
					<View
						style={tw('h-16 pr-1 pl-3 flex flex-1 flex-col justify-between')}
					>
						<View style={tw('flex justify-center h-8')}>
							<Text
								style={tw(
									`text-s-xl ${
										hasSeen === null || hasSeen === true
											? 'font-light'
											: 'font-semibold'
									}`
								)}
								numberOfLines={1}
								ellipsizeMode="tail"
							>
								{threadPreviewData.name[userInfo.uid]}
							</Text>
						</View>
						<View style={tw('flex justify-center h-8')}>
							<Text
								style={tw(
									`text-s-md ${
										hasSeen === null || hasSeen === true
											? 'font-light'
											: 'font-semibold'
									}`
								)}
								numberOfLines={1}
								ellipsizeMode="tail"
							>
								{isSelfMsgPreview ? `you: ${displayMessage}` : displayMessage}
							</Text>
						</View>
					</View>
					<View style={tw('h-full flex justify-center items-center')}>
						<Text style={tw('text-sm leading-7')}>{displayTime}</Text>
					</View>
					{hasSeen === false && (
						<View style={tw('h-full flex justify-center items-center pl-2')}>
							<FontAwesomeIcon icon={faDotCircle} style={tw('text-red-500')} />
						</View>
					)}
				</View>
			</TouchableWithoutFeedback>
		</>
	);
};

export default ThreadPreview;
