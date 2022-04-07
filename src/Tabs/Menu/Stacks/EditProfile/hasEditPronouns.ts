import { UserProfile } from 'types';

export type HasEditPronouns = (
	edittedUserProfile: UserProfile | null | undefined,
	userProfile: UserProfile | null | undefined
) => boolean;

/**
 * util function to determine of user has editted their displayName
 */
const hasEditPronouns: HasEditPronouns = (edittedUserProfile, userProfile) => {
	if (!userProfile) throw 'userProfile was falsy';
	if (!edittedUserProfile) throw 'edittedUserProfile was falsy';
	return (
		JSON.stringify(userProfile.pronouns) !==
		JSON.stringify(edittedUserProfile.pronouns)
	);
};
export default hasEditPronouns;
