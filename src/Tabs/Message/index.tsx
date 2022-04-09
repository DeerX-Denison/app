import { RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { MessageStackParamList, TabsParamList } from 'types';
import { Profile } from '../Listings/Stacks';
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
		<Stack.Navigator initialRouteName="Threads">
			<Stack.Screen
				name="Threads"
				options={{ headerTitle: 'Inbox', headerBackTitle: '' }}
			>
				{(props) => <Threads {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Messages"
				options={{ headerTitle: '', headerBackTitle: '' }}
			>
				{(props) => <Messages {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Profile"
				options={{ headerTitle: '', headerBackTitle: '' }}
				initialParams={{ uid: undefined }}
			>
				{(props) => <Profile {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Message;
