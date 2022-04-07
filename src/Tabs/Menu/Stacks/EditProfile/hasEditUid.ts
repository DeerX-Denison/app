import { UserProfile } from 'types';

export type HasEditUidFn = (
	edittedUserProfile: UserProfile | null | undefined,
	userProfile: UserProfile | null | undefined
) => boolean;

/**
 * util function to determine of user has editted their displayName
 */
const hasEditUid: HasEditUidFn = (edittedUserProfile, userProfile) => {
	if (!userProfile) throw 'userProfile was falsy';
	if (!edittedUserProfile) throw 'edittedUserProfile was falsy';
	return userProfile.uid !== edittedUserProfile.uid;
};
export default hasEditUid;
