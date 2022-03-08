import { createContext } from 'react';
import { UserInfo } from 'types';

const UserContext = createContext<UserInfo | undefined | null>(undefined);

export default UserContext;
