import { DENISON_RED_RGBA } from '@Constants';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { RouteProp } from '@react-navigation/native';
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import tw from '@tw';
import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { SellStackParamList, TabsParamList } from 'types';
import Plus from '../../static/plus.svg';
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
							<Plus height={28} width={28} />
						</TouchableOpacity>
					),
					headerTitle: 'MY LISTINGS',
					headerBackTitle: '',
					headerTintColor: DENISON_RED_RGBA,
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
								icon={faCheck}
								size={24}
								style={tw('text-denison-red')}
							/>
						</TouchableOpacity>
					),
					headerTitle: 'CREATE LISTING',
					headerBackTitle: '',
					headerTintColor: DENISON_RED_RGBA,
				}}
			>
				{(props) => <Create {...props} />}
			</Stack.Screen>
			<Stack.Screen
				name="Edit"
				options={{
					headerRight: () => (
						<TouchableOpacity onPress={() => null}>
							<FontAwesomeIcon
								icon={faCheck}
								size={24}
								style={tw('text-denison-red')}
							/>
						</TouchableOpacity>
					),
					headerTitle: 'EDIT LISTING',
					headerBackTitle: '',
					headerTintColor: DENISON_RED_RGBA,
				}}
			>
				{(props) => <Edit {...props} />}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

export default Sell;
