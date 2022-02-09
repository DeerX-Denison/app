import '@react-native-firebase/app';
import authentication from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import messaging from '@react-native-firebase/messaging';
import cloudStorage from '@react-native-firebase/storage';

if (process.env.NODE_ENV === 'development') {
	console.log('connecting to emulators');
	firestore().useEmulator('localhost', 8080);
	cloudStorage().useEmulator('localhost', 9199);
	// authentication().useEmulator(`http://localhost:9099`);
	functions().useFunctionsEmulator(`http://localhost:5001`);
}

const svTime = firestore.FieldValue.serverTimestamp;
const localTime = firestore.Timestamp.now;

const db = firestore();
const auth = authentication();
const fn = functions();
const storage = cloudStorage();
const msg = messaging();
const crash = crashlytics();

export { db, fn, auth, msg, crash, storage, svTime, localTime };
