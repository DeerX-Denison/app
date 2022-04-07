import { fn } from '@firebase.config';
import { UserPronoun } from 'types';

export type SaveProfileFn = (
	imageUrl: string | undefined,
	bio: string | undefined,
	pronouns: UserPronoun[] | undefined
) => Promise<void>;

type Data = {
	imageUrl: string | undefined;
	bio: string | undefined;
	pronouns: UserPronoun[] | undefined;
};

const saveProfile: SaveProfileFn = async (imageUrl, bio, pronouns) => {
	const data: Data = { imageUrl, bio, pronouns };
	await fn.httpsCallable('updateUserProfile')(data);
};

export default saveProfile;
