import { UserContext } from '@Contexts';
import logger from '@logger';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { useContext, useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { MessageStackParamList, ThreadData } from 'types';
export type RenderMessageHeaderFn = (
	navigation: NativeStackNavigationProp<MessageStackParamList>,
	threadData: ThreadData | undefined
) => void;

const renderHeader: RenderMessageHeaderFn = (navigation, threadData) => {
	const { userInfo } = useContext(UserContext);
	useLayoutEffect(() => {
		if (threadData && userInfo) {
			let uid: string | null;
			if (threadData.membersUid.length === 2) {
				if (threadData.membersUid[0] === threadData.membersUid[1]) {
					uid = userInfo.uid;
				} else {
					const otherUid = threadData.membersUid.filter(
						(uid) => uid !== userInfo.uid
					);
					uid = otherUid[0];
				}
			} else {
				uid = null;
			}
			navigation.setOptions({
				headerTitle: () => (
					<TouchableOpacity
						style={tw('px-4')}
						onPress={() => {
							if (uid) {
								navigation.navigate('Profile', { uid });
							} else {
								logger.error(
									`uid is falsy because threadData.members.length > 2: ${threadData.id}`
								);
								Toast.show({
									type: 'error',
									text1: 'Unexpected Error Occured',
									text2: 'Please Contact Admin',
								});
							}
						}}
					>
						<Text style={tw('text-lg font-bold text-denison-red')}>
							{threadData.name[userInfo.uid]}
						</Text>
					</TouchableOpacity>
				),
			});
		}
	}, [navigation, threadData, userInfo]);
};
export default renderHeader;
