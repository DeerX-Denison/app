import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { MenuStackParamList } from 'types';
import { EditProfile, EditPronouns, Main } from './Stacks';

interface Props {}
/**
 * Menu components, part of the 4 tabs of the app
 */
const Menu: FC<Props> = () => {
	const Stack = createNativeStackNavigator<MenuStackParamList>();

	return (
		<Stack.Navigator initialRouteName="MainMenu">
			<Stack.Screen
				name="MainMenu"
				options={{
					headerTitle: 'MENU',
					headerBackTitle: '',
					headerTintColor: 'rgba(199, 32, 47, 1)',
				}}
				initialParams={{ displayUserProfile: undefined }}
			>
				{(props) => <Main {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="EditProfile"
				initialParams={{
					selectedPronouns: undefined,
					displayUserProfile: undefined,
				}}
				options={{
					headerTitle: 'EDIT PROFILE',
					headerBackTitle: '',
					headerTintColor: 'rgba(199, 32, 47, 1)',
					headerRight: () => (
						<TouchableOpacity onPress={() => null}>
							<FontAwesomeIcon
								icon={faCheck}
								size={24}
								style={tw('text-denison-red')}
							/>
						</TouchableOpacity>
					),
				}}
			>
				{(props) => <EditProfile {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="EditPronouns"
				initialParams={{ pronouns: undefined }}
				options={{
					headerTitle: 'EDIT PRONOUNS',
					headerTintColor: 'rgba(199, 32, 47, 1)',
					headerBackTitle: '',
					headerRight: () => (
						<TouchableOpacity onPress={() => null}>
							<FontAwesomeIcon
								icon={faCheck}
								size={24}
								style={tw('text-denison-red')}
							/>
						</TouchableOpacity>
					),
				}}
			>
				{(props) => <EditPronouns {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Menu;
