import { UserProfile } from 'types';

export type HasEditDisplayNameFn = (
	edittedUserProfile: UserProfile | null | undefined,
	userProfile: UserProfile | null | undefined
) => boolean;

/**
 * util function to determine of user has editted their displayName
 */
const hasEditDisplayName: HasEditDisplayNameFn = (
	edittedUserProfile,
	userProfile
) => {
	if (!userProfile) throw 'userProfile was falsy';
	if (!edittedUserProfile) throw 'edittedUserProfile was falsy';
	return userProfile.displayName !== edittedUserProfile.displayName;
};
export default hasEditDisplayName;
