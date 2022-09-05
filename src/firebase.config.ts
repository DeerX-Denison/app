import _analytics from '@react-native-firebase/analytics';
import '@react-native-firebase/app';
import authentication from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import _dynamicLinks from '@react-native-firebase/dynamic-links';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import messaging from '@react-native-firebase/messaging';
import cloudStorage from '@react-native-firebase/storage';
import config from './config.json';

console.log(`Launching ${config.firebase_env.toUpperCase()} version`);

if (config.firebase_env === 'development') {
	firestore().useEmulator('localhost', 8080);
	cloudStorage().useEmulator('localhost', 9199);
	authentication().useEmulator(`http://localhost:9099`);
	functions().useFunctionsEmulator(`http://localhost:5001`);
	console.log('connected to dev environment');
}

const svTime = firestore.FieldValue.serverTimestamp;
const localTime = firestore.Timestamp.now;

const db = firestore();
const auth = authentication();
const fn = functions();
const storage = cloudStorage();
const msg = messaging();
const crash = crashlytics();
const dynamicLinks = _dynamicLinks();

const analytics = _analytics();
export {
	db,
	fn,
	auth,
	msg,
	crash,
	analytics,
	storage,
	svTime,
	localTime,
	dynamicLinks,
};
