import { createContext } from 'react';
import { UserInfo } from 'types';

const UserContext = createContext<UserInfo | null>(null);

export default UserContext;
