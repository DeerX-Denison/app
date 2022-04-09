import { UserContext } from '@Contexts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { useContext, useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MessageStackParamList, ThreadData } from 'types';
export type RenderMessageHeaderFn = (
	navigation: NativeStackNavigationProp<MessageStackParamList>,
	threadData: ThreadData | undefined
) => void;

const renderHeader: RenderMessageHeaderFn = (navigation, threadData) => {
	const { userInfo } = useContext(UserContext);
	useLayoutEffect(() => {
		if (threadData && userInfo) {
			const otherUid = threadData.membersUid.filter(
				(uid) => uid !== userInfo.uid
			);

			navigation.setOptions({
				headerTitle: () => (
					<TouchableOpacity
						style={tw('px-4')}
						onPress={() => {
							if (otherUid && otherUid.length === 1) {
								navigation.navigate('Profile', {
									uid: otherUid[0],
								});
							}
						}}
					>
						<Text style={tw('text-lg font-bold')}>
							{threadData.name[userInfo.uid]}
						</Text>
					</TouchableOpacity>
				),
			});
		}
	}, [navigation, threadData, userInfo]);
};
export default renderHeader;
