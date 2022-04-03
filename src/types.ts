import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// export type UserInfo = FirebaseAuthTypes.User;
export type UserInfo = {
	uid: string;
	email: string | null;
	photoURL: string | null;
	displayName: string | null;
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

export type ListingsStackParamList = {
	Listings: { reset: boolean };
	Item: { listingId: ListingId };
	Messages: { members: UserInfo[] };
};

export type SellStackParamList = {
	Create: undefined;
	Edit: { listingId: ListingId };
	MyListing: undefined;
};

export type MessageStackParamList = {
	Threads: undefined;
	Messages: { members: UserInfo[] };
};

export type NewThreadUserInfo = {
	uid: string;
	photoURL: string | null;
	displayName: string | null;
};

export type WishlistStackParamList = {
	Wishlist: { reset: boolean };
	Item: { listingId: ListingId };
};

export type MenuStackParamList = {
	MainMenu: undefined;
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
export type ListingSavedBy = number;
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
	savedBy: ListingSavedBy;
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

export type MessageData = {
	id: MessageId;
	sender: MessageSender;
	time: MessageTime;
	contentType: MessageContentType[];
	content: MessageContent;
	membersUid: string[];
	threadName: ThreadName;
	seenAt: MessageSeenAt;
};
export type MessageBlockData = {
	id: MessageId;
	sender: MessageSender;
	time: MessageTime;
	contents: {
		id: MessageId;
		contentType: MessageContentType[];
		content: MessageContent;
		seenAt: MessageSeenAt;
	}[];
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
