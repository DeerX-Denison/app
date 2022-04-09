import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { RouteProp } from '@react-navigation/native';
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import { Button, TouchableOpacity } from 'react-native';
import { SellStackParamList, TabsParamList } from 'types';
import { Create, Edit, MyListings } from './Stacks';

interface Props {
	route: RouteProp<TabsParamList, 'Sell'>;
	navigation: NativeStackNavigationProp<TabsParamList, 'Sell'>;
}

/**
 * Sell components, part of the 5 tabs of the app
 */
const Sell: FC<Props> = () => {
	const Stack = createNativeStackNavigator<SellStackParamList>();

	return (
		<Stack.Navigator
			initialRouteName="MyListing"
			screenOptions={{ headerTitle: 'My Listings', headerBackTitle: '' }}
		>
			<Stack.Screen
				name="MyListing"
				options={({ navigation }) => ({
					headerRight: () => (
						<TouchableOpacity onPress={() => navigation.navigate('Create')}>
							<FontAwesomeIcon
								icon={faPlus}
								size={24}
								style={tw('text-indigo-500')}
							/>
						</TouchableOpacity>
					),
				})}
			>
				{(props) => <MyListings {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Create"
				options={{
					headerRight: () => (
						<TouchableOpacity onPress={() => null}>
							<FontAwesomeIcon
								icon={faPlus}
								size={24}
								style={tw('text-indigo-500')}
							/>
						</TouchableOpacity>
					),
				}}
			>
				{(props) => <Create {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Edit"
				options={{
					headerRight: () => (
						<Button
							title="save"
							onPress={() => {
								// do nothing
							}}
						/>
					),
				}}
			>
				{(props) => <Edit {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Sell;
