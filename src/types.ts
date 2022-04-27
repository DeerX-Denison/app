import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// export type UserInfo = FirebaseAuthTypes.User;
export type UserInfo = {
	uid: string;
	email: string | null;
	photoURL: string | null;
	displayName: string | null;
};

export type UserPronoun =
	| 'CO'
	| 'COS'
	| 'E'
	| 'EY'
	| 'EM'
	| 'EIR'
	| 'FAE'
	| 'FAER'
	| 'HE'
	| 'HIM'
	| 'HIS'
	| 'HER'
	| 'HERS'
	| 'HIR'
	| 'IT'
	| 'ITS'
	| 'MER'
	| 'MERS'
	| 'NE'
	| 'NIR'
	| 'NIRS'
	| 'NEE'
	| 'NER'
	| 'NERS'
	| 'PER'
	| 'PERS'
	| 'SHE'
	| 'THEY'
	| 'THEM'
	| 'THEIRS'
	| 'THON'
	| 'THONS'
	| 'VE'
	| 'VER'
	| 'VIS'
	| 'VI'
	| 'VIR'
	| 'XE'
	| 'XEM'
	| 'XYR'
	| 'ZE'
	| 'ZIR'
	| 'ZIE'
	| undefined;

export type UserProfile = UserInfo & {
	pronouns: UserPronoun[] | undefined | null;
	bio: string | null;
};

export type ProfilePhotoURL = string;
export type ProfilePhotoMetadata = {
	uploaderUid: string;
	imgId: string;
	resized: 'true' | 'false';
	contentValidated: 'true' | 'false';
};

export type HomeTab = {
	screen: 'Listings';
	params: ListingsStackParamList['Listings'];
};
export type InboxTab = {
	screen: 'Messages';
	params: MessageStackParamList['Messages'];
	initial: boolean;
};
export type SellTab = {
	screen: 'Edit';
	params: SellStackParamList['Edit'];
	initial: boolean;
};

// Params/Props types list for tabs and stacks
export type TabsParamList = {
	Home: HomeTab | undefined;
	Inbox: InboxTab | undefined;
	Liked: undefined;
	Menu: undefined;
	Sell: SellTab | undefined;
};

export type ItemScreenParamList = { listingId: ListingId };
export type ListingsStackParamList = {
	Listings: { reset: boolean };
	Item: ItemScreenParamList;
	Messages: { members: UserInfo[] };
	Profile: { uid: string | undefined };
	Edit: { listingId: ListingId };
	Report: {uid: string | undefined}
};

export type SellStackParamList = {
	Create: undefined;
	Edit: { listingId: ListingId };
	MyListing: undefined;
};

export type MessageStackParamList = {
	Threads: undefined;
	Item: ItemScreenParamList;
	Messages: { members: UserInfo[] };
	Profile: { uid: string | undefined };
};

export type NewThreadUserInfo = {
	uid: string;
	photoURL: string | null;
	displayName: string | null;
};

export type WishlistStackParamList = {
	Wishlist: { reset: boolean };
	Item: ItemScreenParamList;
	Profile: { uid: string | undefined };
	Messages: { members: UserInfo[] };
};

export type MenuStackParamList = {
	MainMenu: { displayUserProfile: UserProfile | null | undefined };
	EditProfile: {
		selectedPronouns: UserPronoun[] | null | undefined;
		displayUserProfile: UserProfile | null | undefined;
	};
	EditPronouns: {
		pronouns: UserPronoun[] | null | undefined;
	};
};

export type TestStackParamList = {
	Main: undefined;
	Subscription: undefined;
	CardForm: undefined;
	Duc: undefined;
	Khoi: undefined;
	Minh: undefined;
	Messages: { listingId: ListingId };
};

// Listing types
export type ListingId = string;
export type ListingImageURL = string;
export type ListingImageMetadata = {
	uploader: string;
	listingId: string;
	imageId: string;
	resized: string;
	contentValidated: string;
};
export type ListingName = string;
export type ListingPrice = string;
export type ListingCategory =
	| undefined
	| 'FURNITURE'
	| 'FASHION'
	| 'BOOKS'
	| 'SEASONAL'
	| 'DORM GOODS'
	| 'JEWELRIES'
	| 'ELECTRONIC'
	| 'INSTRUMENT';
export type ListingSeller = UserInfo;
export type ListingCondition =
	| undefined
	| 'BRAND NEW'
	| 'LIKE NEW'
	| 'FAIRLY USED'
	| 'USEABLE'
	| 'BARELY FUNCTIONAL';
export type ListingDescription = string;
export type LikedBy = string[];
export type ListingStatus = 'posted' | 'saved';
export type ListingData = {
	id: ListingId;
	images: ListingImageURL[];
	name: ListingName;
	price: ListingPrice;
	category: ListingCategory[];
	seller: ListingSeller;
	condition: ListingCondition;
	description: ListingDescription;
	createdAt: FirebaseFirestoreTypes.Timestamp | undefined;
	updatedAt: FirebaseFirestoreTypes.Timestamp | undefined;
	likedBy: LikedBy;
	status: ListingStatus;
};

export type MyListingData = ListingData;

// app types
export type Selection = {
	id: string;
	text: string;
};

export type CarouselData = string;

export type ThreadId = string;
export type ThreadMembers = UserInfo;
export type ThreadThumbnail = { [uid: string]: string | undefined };
export type ThreadName = { [key: string]: string | undefined };
export type ThreadLatestTime =
	| FirebaseFirestoreTypes.Timestamp
	| undefined
	| null;
export type ThreadLatestSeenAt = {
	[key: string]: FirebaseFirestoreTypes.Timestamp | undefined | null;
};
export type ThreadLatestMessages = string | undefined | null;
export type ThreadLatestSenderUid = string | undefined | null;
export type ThreadPreviewData = {
	id: ThreadId;
	members: ThreadMembers[];
	membersUid: string[];
	thumbnail: ThreadThumbnail;
	name: ThreadName;
	latestMessage: ThreadLatestMessages;
	latestTime: ThreadLatestTime;
	latestSeenAt: ThreadLatestSeenAt;
	latestSenderUid: ThreadLatestSenderUid;
};
export type ThreadPreviewDataSv = Omit<ThreadPreviewData, 'name'>;

export type MessageId = string;
export type MessageSender = Omit<UserInfo, 'email'>;
export type MessageTime = FirebaseFirestoreTypes.Timestamp;
export type MessageSeenAt = {
	[key: string]: FirebaseFirestoreTypes.Timestamp | null;
};
//add below more further on: image, listing reference, etc.
export type MessageContentType = 'text' | 'reference';
export type MessageContent = string;
export type MessageReferenceData = {
	begin: number;
	end: number;
	data: {
		id: ListingId;
		thumbnail: ListingImageURL;
	};
};
export type InputTextRef = {
	begin: number;
	end: number;
	data: WishlistDataCL;
};
export type TextSelection = {
	start: number;
	end: number;
};
export type WithinRef = {
	isWithinRef: boolean;
	whichRef: InputTextRef | undefined;
};
export type MessageData = {
	id: MessageId;
	sender: MessageSender;
	time: MessageTime;
	contentType: MessageContentType[];
	content: MessageContent;
	membersUid: string[];
	threadName: ThreadName;
	seenAt: MessageSeenAt;
	refs: MessageReferenceData[];
};
export type MessageBlockContent = {
	id: MessageId;
	contentType: MessageContentType[];
	content: MessageContent;
	seenAt: MessageSeenAt;
	refs: MessageReferenceData[];
};
export type MessageBlockData = {
	id: MessageId;
	sender: MessageSender;
	time: MessageTime;
	contents: MessageBlockContent[];
};
export type ThreadData = ThreadPreviewData & {
	messages: MessageData[];
};
export type ThreadDataSv = ThreadData;

export type WishlistDataCL = {
	id: ListingId;
	thumbnail: ListingImageURL;
	name: ListingName;
	price: ListingPrice;
	seller: ListingSeller;
};

export type UserFCMTokenData = {
	token: string;
	device: string;
	updatedAt:
		| FirebaseFirestoreTypes.Timestamp
		| FirebaseFirestoreTypes.FieldValue;
};

export type SeenAts = {
	[key: MessageId]: {
		[key: UserInfo['uid']]: FirebaseFirestoreTypes.Timestamp | null;
	};
};

export type SeenIcons = {
	[key: UserInfo['uid']]: MessageId | null;
};

export type UseSeenIconsFn = (threadData: ThreadData | null | undefined) => {
	seenIcons: SeenIcons | undefined;
	setSeenIcons: React.Dispatch<React.SetStateAction<SeenIcons | undefined>>;
};
