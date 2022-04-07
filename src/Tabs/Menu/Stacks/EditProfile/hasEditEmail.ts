import { UserProfile } from 'types';

export type HasEditEmail = (
	edittedUserProfile: UserProfile | null | undefined,
	userProfile: UserProfile | null | undefined
) => boolean;

/**
 * util function to determine of user has editted their displayName
 */
const hasEditEmail: HasEditEmail = (edittedUserProfile, userProfile) => {
	if (!userProfile) throw 'userProfile was falsy';
	if (!edittedUserProfile) throw 'edittedUserProfile was falsy';
	return userProfile.email !== edittedUserProfile.email;
};
export default hasEditEmail;
