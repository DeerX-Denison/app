import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { MessageStackParamList, TabsParamList } from 'types';
import { Messages, Threads } from './Stacks';
interface Props {
	route: RouteProp<TabsParamList, 'Inbox'>;
}

/**
 * Message components, part of the 4 tabs of the app
 */
const Message: FC<Props> = () => {
	const Stack = createNativeStackNavigator<MessageStackParamList>();
	return (
		<Stack.Navigator
			initialRouteName="Threads"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Threads">
				{(props) => <Threads {...props} />}
			</Stack.Screen>
			<Stack.Screen name="Messages">
				{(props) => <Messages {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Message;
