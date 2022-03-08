import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext } from 'react';
import { UserInfo } from 'types';
type T = {
	user: FirebaseAuthTypes.User | null | undefined;
	userInfo: UserInfo | null | undefined;
};
const UserContext = createContext<T>({ user: undefined, userInfo: undefined });

export default UserContext;
