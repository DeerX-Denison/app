import { UserContext } from '@Contexts';
import { useAnalytics, useAuth, useFCMToken, useNotification } from '@Hooks';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Listings, Menu, Message, Wishlist } from '@Tabs';
import React, { FC } from 'react';
import Toast from 'react-native-toast-message';
import { TabsParamList } from 'types';
import SignIn from './SignIn';

interface Props {}

const App: FC<Props> = () => {
	const user = useAuth();
	const Tab = createBottomTabNavigator<TabsParamList>();
	useFCMToken(user);
	useNotification(user);
	useAnalytics(user);

	return (
		<>
			{user ? (
				// if user is logged in, display tabs
				<>
					<UserContext.Provider value={user}>
						<NavigationContainer>
							<Tab.Navigator
								screenOptions={{ headerTitle: 'DeerX' }}
								initialRouteName="Listings"
							>
								<Tab.Screen name="Listings">
									{(props) => <Listings {...props} />}
								</Tab.Screen>
								<Tab.Screen name="Message">
									{(props) => <Message {...props} />}
								</Tab.Screen>
								<Tab.Screen name="Wishlist">
									{(props) => <Wishlist {...props} />}
								</Tab.Screen>
								<Tab.Screen name="Menu">
									{(props) => <Menu {...props} />}
								</Tab.Screen>
							</Tab.Navigator>
						</NavigationContainer>
						<Toast />
					</UserContext.Provider>
				</>
			) : (
				// else display login
				<>
					<SignIn />
				</>
			)}
		</>
	);
};
export default App;
