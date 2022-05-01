import * as Buttons from '@Components/Buttons';
import { auth, fn } from '@firebase.config';
import logger from '@logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import tw from '@tw';
import React, { FC, useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Bar, CircleSnail } from 'react-native-progress';
import config from '../config.json';
import Message from './Message';
import useEmailLinkEffect from './useEmailLinkEffect';

/**
 * utility hook to parse email from big red id
 */
const useEmail = () => {
	const [bigRedId, setBigRedId] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	useEffect(() => {
		setEmail(`${bigRedId}@denison.edu`);
	}, [bigRedId]);
	return { bigRedId, setBigRedId, email, setEmail };
};

/**
 * utility hook to manage tester email and pw
 */
const useTesterEmail = () => {
	const [testerEmail, setTesterEmail] = useState<string>('');
	const [testerPw, setTesterPw] = useState<string>('');
	const [testerEmailError, setTesterEmailError] = useState<string>('');
	return {
		testerEmail,
		setTesterEmail,
		testerPw,
		setTesterPw,
		testerEmailError,
		setTesterEmailError,
	};
};

/**
 * SignIn component, check if user is signed in, if yes, move on to main, else render the form
 */
const SignIn: FC = () => {
	const { bigRedId, setBigRedId, email } = useEmail();
	const {
		testerEmail,
		setTesterEmail,
		testerPw,
		setTesterPw,
		testerEmailError,
		setTesterEmailError,
	} = useTesterEmail();

	const [emailSent, setEmailSent] = useState<boolean>(false);
	const [emailError, setEmailError] = useState('');
	const [sending, setSending] = useState<boolean>(false);
	const [isTester, setIsTester] = useState<boolean>(false);
	const [isViewingPw, setIsViewingPw] = useState<boolean>(false);
	const { loading } = useEmailLinkEffect();

	/**
	 * utility function to validate user input big red id and email
	 */
	const isValidEmail = () => {
		if (bigRedId === '') {
			setEmailError('Please enter your Big Red ID');
			return false;
		}
		const regex = /^.*@denison.edu$/g;
		if (!regex.test(email)) {
			setEmailError('Please use your Denison email address');
			return false;
		} else {
			setEmailError('');
			return true;
		}
	};

	/**
	 * utiltiy function to validate tester input email
	 */
	const isValidTesterEmail = () => {
		if (testerEmail.trim().toLowerCase() !== 'deerx.test@gmail.com') {
			setTesterEmailError('Invalid tester email');
			return false;
		} else {
			return true;
		}
	};

	const signInHandler = async () => {
		if (isValidEmail()) {
			if (emailError === '') {
				if (email.trim().toLowerCase() === 'deerx.test@denison.edu') {
					setIsTester(true);
				} else {
					const actionCodeSettings: FirebaseAuthTypes.ActionCodeSettings = {
						handleCodeInApp: true,
						// URL must be whitelisted in the Firebase logger.
						url: config.authURL,
						iOS: {
							bundleId: 'denison.deerx.app',
						},
						android: { packageName: 'denison.deerx.app' },
						dynamicLinkDomain: config.dynamicLinkDomain,
					};
					try {
						setSending(true);
						// await auth.sendSignInLinkToEmail(email, actionCodeSettings);
						await fn.httpsCallable('sendSignInEmail')({
							email,
							actionCodeSettings,
						});
						await AsyncStorage.setItem('emailForSignIn', email);
						setSending(false);
						setEmailSent(true);
					} catch (error) {
						logger.log(error);
						logger.error(error);
					} finally {
						setSending(false);
					}
				}
			}
		}
	};

	const signInAsTesterHandler = async () => {
		try {
			await auth.signInWithEmailAndPassword(testerEmail, testerPw);
		} catch (error) {
			if (error) {
				logger.error(error);
			}
		}
	};
	return (
		<>
			{loading ? (
				// if is loading, render deer loading screen
				<>
					<View
						testID="loading"
						style={tw('flex flex-col flex-1 justify-center items-center')}
					>
						<Bar width={200} indeterminate={true} />
					</View>
				</>
			) : (
				// if not loading to check authentication, render sign in
				<>
					{isTester ? (
						// render tester login
						<>
							<KeyboardAwareScrollView
								testID="tester-login"
								contentContainerStyle={tw(
									'flex-1 flex-col justify-start items-center'
								)}
								scrollEnabled={false}
							>
								<Text
									style={tw(
										'mb-3 mt-60 text-center text-3xl font-extrabold text-gray-900'
									)}
								>
									Sign In As Tester
								</Text>
								<View
									style={tw(
										'my-1 flex flex-col justify-between items-center w-96'
									)}
								>
									<TextInput
										placeholder="Tester Email"
										placeholderTextColor={'gray'}
										onChangeText={(testerEmail) => {
											setTesterEmailError('');
											setTesterEmail(testerEmail.trim());
										}}
										autoComplete="email"
										value={testerEmail}
										onEndEditing={isValidTesterEmail}
										autoCapitalize="none"
										style={tw(
											'font-medium text-s-md p-2 border w-7/12 rounded-md m-1'
										)}
									/>
								</View>

								<View
									style={tw(
										'my-1 flex flex-col justify-between items-center w-96'
									)}
								>
									<TextInput
										placeholder="Tester Password"
										placeholderTextColor={'gray'}
										onChangeText={setTesterPw}
										value={testerPw}
										secureTextEntry={!isViewingPw}
										autoComplete="password"
										style={tw(
											'font-medium text-s-md p-2 border w-7/12 rounded-md m-1'
										)}
									/>
									<Buttons.Primary
										size="md"
										onPress={() => setIsViewingPw(!isViewingPw)}
										title="View Password"
									/>
								</View>
								{testerEmailError !== '' && (
									<Text style={tw('text-red-400')}>{testerEmailError}</Text>
								)}
								<View style={tw('my-1')}>
									<Buttons.Primary
										size="md"
										onPress={signInAsTesterHandler}
										title="Sign In As Tester"
									/>
								</View>
								<View style={tw('my-1')}>
									<Buttons.Primary
										size="md"
										onPress={() => setIsTester(false)}
										title="Back"
									/>
								</View>
							</KeyboardAwareScrollView>
						</>
					) : (
						// render normal user login
						<>
							<KeyboardAwareScrollView
								testID="user-login"
								contentContainerStyle={tw(
									'flex-1 flex-col justify-start items-center'
								)}
								scrollEnabled={false}
							>
								<Text
									style={tw(
										'mb-3 mt-60 text-center text-3xl font-extrabold text-denison-red'
									)}
								>
									SIGN IN
								</Text>
								<View
									style={tw(
										'my-3 w-3/4 h-12 flex flex-row justify-between items-center'
									)}
								>
									<TextInput
										placeholder="Big_Red_ID"
										placeholderTextColor={'gray'}
										onChangeText={(bigRedId) => {
											setEmailError('');
											setBigRedId(bigRedId.trim());
										}}
										value={bigRedId}
										onEndEditing={isValidEmail}
										autoCapitalize="none"
										style={tw(
											'font-medium text-s-md flex-1 p-2 border border-denison-red border-2 bg-gray rounded-tl-2xl rounded-bl-2xl h-full'
										)}
									/>
									<View
										style={tw(
											'bg-gray-300 p-2 border border-denison-red border-2 rounded-tr-2xl rounded-br-2xl h-full flex flex-col justify-center items-center'
										)}
									>
										<Text style={tw('font-medium text-gray-500 text-s-md')}>
											@denison.edu
										</Text>
									</View>
								</View>

								{emailError !== '' && (
									<Text style={tw('text-red-400')}>{emailError}</Text>
								)}
								<View style={tw('my-3')}>
									{sending ? (
										<CircleSnail
											size={40}
											indeterminate={true}
											color={['red', 'green', 'blue']}
										/>
									) : (
										<Buttons.Primary
											size="md"
											onPress={signInHandler}
											title="Sign In"
											disabled={emailSent}
										/>
									)}
								</View>
								{emailSent && <Message setEmailSent={setEmailSent} />}
							</KeyboardAwareScrollView>
						</>
					)}
				</>
			)}
			{config.firebase_env !== 'production' && (
				<View style={tw('items-center p-8')}>
					<Text>Staging Version</Text>
				</View>
			)}
		</>
	);
};

export default SignIn;
