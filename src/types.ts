import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// export type UserInfo = FirebaseAuthTypes.User;
export type UserInfo = {
	uid: string;
	email: string | null;
	photoURL: string | null;
	displayName: string | null;
};

// Params/Props types list for tabs and stacks
export type TabsParamList = {
	Home: undefined;
	Inbox: {
		screen: 'Messages';
		params: MessageStackParamList['Messages'];
	};
	Liked: undefined;
	Menu: undefined;
	Sell: {
		screen: 'Edit';
		params: SellStackParamList['Edit'];
	};
};

export type ListingsStackParamList = {
	Main: undefined;
	Item: { listingId: ListingId };
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
	Main: undefined;
	Item: { listingId: ListingId };
};

export type MenuStackParamList = {
	Main: undefined;
	SignIn: undefined;
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
	readonly createdAt: FirebaseFirestoreTypes.Timestamp | undefined;
	readonly updatedAt: FirebaseFirestoreTypes.Timestamp | undefined;
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
export type ThreadLatestMessages = string | undefined | null;
export type ThreadPreviewData = {
	id: ThreadId;
	members: ThreadMembers[];
	membersUid: string[];
	thumbnail: ThreadThumbnail;
	name: ThreadName;
	latestMessage: ThreadLatestMessages;
	latestTime: ThreadLatestTime;
};
export type ThreadPreviewDataSv = Omit<ThreadPreviewData, 'name'>;

export type MessageId = string;
export type MessageSender = Omit<UserInfo, 'email'>;
export type MessageTime = FirebaseFirestoreTypes.Timestamp;

//add below more further on: image, listing reference, etc.
export type MessageContentType = 'text';
export type MessageContent = string;
export type MessageData = {
	id: MessageId;
	sender: MessageSender;
	time: MessageTime;
	contentType: MessageContentType;
	content: MessageContent;
	membersUid: string[];
	threadName: ThreadName;
};
export type MessageBlockData = {
	id: MessageId;
	sender: MessageSender;
	time: MessageTime;
	contents: {
		id: MessageId;
		contentType: MessageContentType;
		content: MessageContent;
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
