import '@react-native-firebase/app';
import authentication from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import messaging from '@react-native-firebase/messaging';
import cloudStorage from '@react-native-firebase/storage';
import config from './config.json';

if (config.env === 'development') {
	console.log('connecting to emulators');
	firestore().useEmulator(config.localIp, 8080);
	cloudStorage().useEmulator(config.localIp, 9199);
	// authentication().useEmulator(`http://${config.localIp}:9099`);
	functions().useFunctionsEmulator(`http://${config.localIp}:5001`);
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
