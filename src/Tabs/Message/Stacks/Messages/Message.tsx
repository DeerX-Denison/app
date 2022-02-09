import { DEFAULT_MESSAGE_THUMBNAIL } from '@Constants';
import { useCurrentTime, useMessageDisplayTime } from '@Hooks';
import tw from '@tw';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import 'react-native-get-random-values';
import { MessageBlockData } from 'types';

interface Props {
	message: MessageBlockData;
}

/**
 * Message component, Threads contains Thread contains Messages contains Message
 */
const Message: FC<Props> = ({ message }) => {
	const { curTime } = useCurrentTime();
	const { displayTime } = useMessageDisplayTime(message.time.toDate(), curTime);
	return (
		<>
			<View style={tw('p-2 flex-row')}>
				<FastImage
					source={{
						uri: message.sender.photoURL
							? message.sender.photoURL
							: DEFAULT_MESSAGE_THUMBNAIL,
					}}
					style={tw('w-8 h-8 rounded-full')}
				/>

				<View style={tw('pl-3 flex-shrink')}>
					<View style={tw('flex-col')}>
						<View style={tw('flex-row justify-start items-end')}>
							<Text style={tw('text-s-lg font-normal pr-4 text-gray-600')}>
								{message.sender.displayName}
							</Text>
							<Text style={tw('text-s-md font-normal text-gray-600')}>
								{displayTime}
							</Text>
						</View>

						{message.contents.map((content) => (
							<Text key={content.id} style={tw('text-s-md')}>
								{content.content}
							</Text>
						))}
					</View>
				</View>
			</View>
		</>
	);
};

export default Message;
