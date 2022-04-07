import { UserProfile } from 'types';

export type HasEditBio = (
	edittedUserProfile: UserProfile | null | undefined,
	userProfile: UserProfile | null | undefined
) => boolean;

/**
 * util function to determine of user has editted their displayName
 */
const hasEditBio: HasEditBio = (edittedUserProfile, userProfile) => {
	if (!userProfile) throw 'userProfile was falsy';
	if (!edittedUserProfile) throw 'edittedUserProfile was falsy';
	return userProfile.bio !== edittedUserProfile.bio;
};
export default hasEditBio;
