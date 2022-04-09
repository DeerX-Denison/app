import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext } from 'react';
import { UserInfo, UserProfile } from 'types';
type T = {
	user: FirebaseAuthTypes.User | null | undefined;
	userInfo: UserInfo | null | undefined;
	userProfile: UserProfile | null | undefined;
};
const UserContext = createContext<T>({
	user: undefined,
	userInfo: undefined,
	userProfile: undefined,
});

export default UserContext;
