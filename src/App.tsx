import { UserContext } from '@Contexts';
import {
	faBars,
	faHeart,
	faHouse,
	faMessage,
	faStore,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
	useAnalytics,
	useAuth,
	useBackgroundLink,
	useFCMToken,
	useForegroundLink,
	useNotification,
} from '@Hooks';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
	NavigationContainer,
	useNavigationContainerRef,
} from '@react-navigation/native';
import { Listings, Menu, Message, Sell, Wishlist } from '@Tabs';
import tw from '@tw';
import React, { FC } from 'react';
import Toast from 'react-native-toast-message';
import { HomeTab, InboxTab, SellTab, TabsParamList } from 'types';
import SignIn from './SignIn';
interface Props {}

const App: FC<Props> = () => {
	const navigationRef = useNavigationContainerRef<TabsParamList>();
	const { initialRoute, initialParams } = useNotification(navigationRef);
	const { user, userInfo } = useAuth();
	const Tab = createBottomTabNavigator<TabsParamList>();
	useFCMToken(userInfo);
	useAnalytics(userInfo);
	useBackgroundLink(navigationRef);
	useForegroundLink(navigationRef);

	return (
		<>
			{user ? (
				// if user is logged in, display tabs
				<>
					{initialRoute !== null && initialParams !== null && (
						<UserContext.Provider value={{ user, userInfo }}>
							<NavigationContainer ref={navigationRef}>
								<Tab.Navigator
									initialRouteName={initialRoute}
									screenOptions={{ headerShown: false, tabBarShowLabel: false }}
								>
									<Tab.Screen
										name="Home"
										initialParams={initialParams as HomeTab}
										options={{
											tabBarIcon: ({ focused, size }) => (
												<FontAwesomeIcon
													icon={faHouse}
													size={size}
													style={tw(
														`${focused ? 'text-red-500' : 'text-indigo-500'}`
													)}
												/>
											),
										}}
									>
										{(props) => <Listings {...props} />}
									</Tab.Screen>
									<Tab.Screen
										name="Inbox"
										initialParams={initialParams as InboxTab}
										options={{
											tabBarIcon: ({ focused, size }) => (
												<FontAwesomeIcon
													icon={faMessage}
													size={size}
													style={tw(
														`${focused ? 'text-red-500' : 'text-indigo-500'}`
													)}
												/>
											),
										}}
									>
										{(props) => <Message {...props} />}
									</Tab.Screen>
									<Tab.Screen
										name="Sell"
										initialParams={initialParams as SellTab}
										options={{
											tabBarIcon: ({ focused, size }) => (
												<FontAwesomeIcon
													icon={faStore}
													size={size}
													style={tw(
														`${focused ? 'text-red-500' : 'text-indigo-500'}`
													)}
												/>
											),
										}}
									>
										{(props) => <Sell {...props} />}
									</Tab.Screen>
									<Tab.Screen
										name="Liked"
										initialParams={initialParams as undefined}
										options={{
											tabBarIcon: ({ focused, size }) => (
												<FontAwesomeIcon
													icon={faHeart}
													size={size}
													style={tw(
														`${focused ? 'text-red-500' : 'text-indigo-500'}`
													)}
												/>
											),
										}}
									>
										{(props) => <Wishlist {...props} />}
									</Tab.Screen>
									<Tab.Screen
										name="Menu"
										initialParams={initialParams as undefined}
										options={{
											tabBarIcon: ({ focused, size }) => (
												<FontAwesomeIcon
													icon={faBars}
													size={size}
													style={tw(
														`${focused ? 'text-red-500' : 'text-indigo-500'}`
													)}
												/>
											),
										}}
									>
										{(props) => <Menu {...props} />}
									</Tab.Screen>
								</Tab.Navigator>
							</NavigationContainer>
							<Toast />
						</UserContext.Provider>
					)}
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
