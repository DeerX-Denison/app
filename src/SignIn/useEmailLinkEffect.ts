import { JustSignOut } from '@Contexts';
import { auth } from '@firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

/**
 * utility hook to analyze direct links to parse user intent to login
 */
const useEmailLinkEffect: () => {
	error: Error | null;
	loading: boolean;
} = () => {
	const { justSignOut, setJustSignOut } = useContext(JustSignOut);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (error) {
			if (error.message.includes('[auth/invalid-action-code]')) {
				if (justSignOut === false) {
					Toast.show({
						type: 'error',
						text1: 'Invalid Authenticate Link',
						text2: 'Please Try Again',
					});
				}
			} else {
				Toast.show({
					type: 'error',
					text1: 'Unexpected Error Occured',
					text2: 'Please Try Again',
				});
			}
		}
	}, [error, justSignOut]);

	useEffect(() => {
		let isSubscribed = true;
		const handleDynamicLink = async (link: { url: string }) => {
			// Check and handle if the link is a email login link
			if (auth.isSignInWithEmailLink(link.url)) {
				isSubscribed && setLoading(true);

				try {
					// use the email we saved earlier
					const email = await AsyncStorage.getItem('emailForSignIn');
					if (email) {
						await auth.signInWithEmailLink(email, link.url);
						setJustSignOut && setJustSignOut(false);
					} else {
						throw Error('Email not in async storage');
					}
					/* You can now navigate to your initial authenticated screen
			  You can also parse the `link.url` and use the `continueurl` param to go to another screen
			  The `continueurl` would be the `url` passed to the action code settings */
				} catch (e: unknown) {
					isSubscribed && setError(e as Error);
				} finally {
					isSubscribed && setLoading(false);
				}
			}
		};

		const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

		/* When the app is not running and is launched by a magic link the `onLink`
		  method won't fire, we can handle the app being launched by a magic link like this */
		dynamicLinks()
			.getInitialLink()
			.then((link) => link && handleDynamicLink(link));

		// When the component is unmounted, remove the listener
		return () => {
			isSubscribed = false;
			return unsubscribe();
		};
	}, []);

	return { error, loading };
};

export default useEmailLinkEffect;
