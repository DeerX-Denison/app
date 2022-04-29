import { MESSAGE_MENU_ANIM_TIME } from '@Constants';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MessageStackParamList } from 'types';

interface Props {
	messageId: string;
	setShowingMenu: React.Dispatch<React.SetStateAction<string | undefined>>;
	setShowingMenuNow: React.Dispatch<React.SetStateAction<string | undefined>>;
	navigation: NativeStackNavigationProp<MessageStackParamList>;
}

const MessageMenu: FC<Props> = ({
	messageId,
	setShowingMenu,
	setShowingMenuNow,
	navigation,
}) => {
	return (
		<View style={tw('absolute -top-14')}>
			<TouchableOpacity
				style={tw(
					'w-12 h-12 rounded-full bg-gray flex justify-center items-center'
				)}
				onPress={() => {
					// turn off button
					setShowingMenuNow(undefined);
					setTimeout(() => {
						setShowingMenu(undefined);
					}, MESSAGE_MENU_ANIM_TIME);
					navigation.navigate('Report', { type: 'message', id: messageId });
				}}
			>
				<FontAwesomeIcon
					icon={faFlag}
					size={20}
					style={tw('text-denison-red')}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default MessageMenu;
