import { UserContext } from '@Contexts';
import { useAnalytics, useAuth, useFCMToken, useNotification } from '@Hooks';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Listings, Menu, Message, Sell, Wishlist } from '@Tabs';
import React, { FC } from 'react';
import Toast from 'react-native-toast-message';
import { TabsParamList } from 'types';
import SignIn from './SignIn';
import renderHomeBackButton from './utils/renderHomeBackButton';
import renderInboxBackButton from './utils/renderInboxBackButton';
import renderLikedBackButton from './utils/renderLikedBackButton';

interface Props {}

const App: FC<Props> = () => {
	const { user, userInfo } = useAuth();
	const Tab = createBottomTabNavigator<TabsParamList>();
	useFCMToken(userInfo);
	useNotification(userInfo);
	useAnalytics(userInfo);

	return (
		<>
			{user ? (
				// if user is logged in, display tabs
				<>
					<UserContext.Provider value={{ user, userInfo }}>
						<NavigationContainer>
							<Tab.Navigator initialRouteName="Home">
								<Tab.Screen
									name="Home"
									options={({ route, navigation }) => ({
										headerLeft: () => renderHomeBackButton(route, navigation),
									})}
								>
									{(props) => <Listings {...props} />}
								</Tab.Screen>
								<Tab.Screen
									name="Inbox"
									options={({ route, navigation }) => ({
										headerLeft: () => renderInboxBackButton(route, navigation),
									})}
								>
									{(props) => <Message {...props} />}
								</Tab.Screen>
								<Tab.Screen name="Sell">
									{(props) => <Sell {...props} />}
								</Tab.Screen>
								<Tab.Screen
									name="Liked"
									options={({ route, navigation }) => ({
										headerLeft: () => renderLikedBackButton(route, navigation),
									})}
								>
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
