import { UserContext } from '@Contexts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContext, useLayoutEffect } from 'react';
import { MessageStackParamList, ThreadData } from 'types';

export type RenderMessageHeaderFn = (
	navigation: NativeStackNavigationProp<MessageStackParamList>,
	threadData: ThreadData | undefined
) => void;

const renderHeader: RenderMessageHeaderFn = (navigation, threadData) => {
	const { userInfo } = useContext(UserContext);
	useLayoutEffect(() => {
		if (threadData && userInfo) {
			navigation.setOptions({ headerTitle: threadData.name[userInfo.uid] });
		}
	}, [navigation, threadData, userInfo]);
};
export default renderHeader;
