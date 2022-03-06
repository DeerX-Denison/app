import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { MessageStackParamList, TabsParamList, UserInfo } from 'types';
import { Messages, Threads } from './Stacks';

interface Props {
	route: RouteProp<TabsParamList, 'Inbox'>;
}

/**
 * custom hook to parase direct thread member from route.params. returns {undefined} if not present
 */
const useDirectThreadMember = (route: RouteProp<TabsParamList, 'Inbox'>) => {
	const [directThreadMembers, setDirectThreadMembers] = useState<
		UserInfo[] | undefined
	>();

	useEffect(() => {
		if (route.params && 'directThreadMembers' in route.params) {
			setDirectThreadMembers(route.params.directThreadMembers);
		}
	}, [route]);
	return { directThreadMembers };
};

/**
 * Message components, part of the 4 tabs of the app
 */
const Message: FC<Props> = ({ route }) => {
	const Stack = createNativeStackNavigator<MessageStackParamList>();
	const { directThreadMembers } = useDirectThreadMember(route);
	return (
		<Stack.Navigator
			initialRouteName="Threads"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Threads">
				{(props) => (
					<Threads {...props} directThreadMembers={directThreadMembers} />
				)}
			</Stack.Screen>
			<Stack.Screen name="Messages">
				{(props) => <Messages {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Message;
