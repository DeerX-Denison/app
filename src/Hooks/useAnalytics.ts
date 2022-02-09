import { crash } from '@firebase.config';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useEffect } from 'react';

const useAnalytics = (user: FirebaseAuthTypes.User | null | undefined) => {
	useEffect(() => {
		crash.log('App mounted');
		if (user) {
			crash.log('User logged in');
			crash.setUserId(user.uid);
		}
	}, [user]);
};
export default useAnalytics;
