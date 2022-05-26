import {
	ListingCategory,
	ListingCondition,
	ListingStatus,
	UserPronoun,
} from 'types';
export const DENISON_RED_RGBA = 'rgba(199, 32, 47, 1)';
export const PINK_RGBA = 'rgba(241, 141, 158, 1)';
export const GRAY_RGBA = 'rgba(245, 245, 249, 1)';
export const LISTING_PER_PAGE = 20;
export const TIME_TO_RESEND_SIGNIN_EMAIL = 30;
export const TIME_TO_RECREATE_USER = 3000; // ms
export const DEFAULT_MESSAGE_THUMBNAIL =
	'https://i.ibb.co/Y26TN8k/denison-icon-red.jpg';
export const DEFAULT_MESSAGE_NAME = 'New conversation';
export const DEFAULT_SELF_MESSAGE_NAME = 'Message to self';
export const DEFAULT_LATEST_MESSAGE = 'Send your first message';
export const MESSAGE_PER_PAGE = 25;
export const CREATE_EDIT_SCROLLVIEW_EXTRA_HEIGHT_IP12 = 20;
export const FCM_TOKEN_UPDATE_DAY = 7;
export const MILLIES_TO_SPLIT_MESSAGES = 120000; // 120 seconds
export const THREADS_PER_PAGE = 10;
export const NEW_THREAD_SUGGESTIONS = 5;
export const DEFAULT_USER_DISPLAY_NAME = 'New User';
export const DEFAULT_USER_PHOTO_URL =
	'https://i.ibb.co/Y26TN8k/denison-icon-red.jpg';
export const WISHLIST_PER_PAGE = 10;
export const MY_LISTINGS_PER_PAGE = 10;
export const MESSAGE_MENU_ANIM_TIME = 250;
export const MESSAGE_TEXT_INPUT_PLACEHOLDER = '@ To Reference An Item';
export const MESSAGE_DIRECT_FROM_LISTING = 'Hi, I would like to buy';

// make sure this match BE
export const DEFAULT_GUEST_EMAIL = 'guest-user-email';

// make sure this match BE
export const DEFAULT_GUEST_DISPLAY_NAME = 'Guest User';

// make sure this match BE
export const CONDITIONS: Exclude<ListingCondition, undefined>[] = [
	'BRAND NEW',
	'LIKE NEW',
	'FAIRLY USED',
	'USEABLE',
	'BARELY FUNCTIONAL',
];

// make sure this match BE
export const CATEGORIES: Exclude<ListingCategory, undefined>[] = [
	'BOOKS',
	'DORM GOODS',
	'ELECTRONIC',
	'FASHION',
	'FURNITURE',
	'INSTRUMENT',
	'JEWELRIES',
	'SEASONAL',
];

// make sure this match BE
export const STATUSES: ListingStatus[] = ['posted', 'saved', 'sold'];

// make sure this match BE
export const PRONOUNS: Exclude<UserPronoun, undefined>[] = [
	'CO',
	'COS',
	'E',
	'EY',
	'EM',
	'EIR',
	'FAE',
	'FAER',
	'HE',
	'HIM',
	'HIS',
	'HER',
	'HERS',
	'HIR',
	'IT',
	'ITS',
	'MER',
	'MERS',
	'NE',
	'NIR',
	'NIRS',
	'NEE',
	'NER',
	'NERS',
	'PER',
	'PERS',
	'SHE',
	'THEY',
	'THEM',
	'THEIRS',
	'THON',
	'THONS',
	'VE',
	'VER',
	'VIS',
	'VI',
	'VIR',
	'XE',
	'XEM',
	'XYR',
	'ZE',
	'ZIR',
	'ZIE',
];
