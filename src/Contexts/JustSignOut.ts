import React, { createContext } from 'react';
type T = {
	justSignOut: boolean | undefined;
	setJustSignOut: React.Dispatch<React.SetStateAction<boolean>> | undefined;
};
const JustSignOut = createContext<T>({
	justSignOut: undefined,
	setJustSignOut: undefined,
});

export default JustSignOut;
