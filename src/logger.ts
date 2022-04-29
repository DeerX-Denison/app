import { crash } from '@firebase.config';
import Toast from 'react-native-toast-message';

interface ILogger {
	log: (x: unknown) => void;
	error: (x: unknown) => void;
	debug: (x: unknown) => void;
	warn: (x: unknown) => void;
}

class Logger implements ILogger {
	log(x: unknown) {
		console.log(x);
	}

	error(x: unknown) {
		console.error(x);

		if (x instanceof Error) {
			Toast.show({ type: 'error', text1: x.message });
			crash.recordError(x);
		} else {
			Toast.show({ type: 'error', text1: 'Unexpected error occured' });
			crash.recordError(new Error(JSON.stringify(x)));
		}
	}

	debug(x: unknown) {
		console.debug(x);
	}

	warn(x: unknown) {
		console.warn(x);
	}
}

const logger = new Logger();

export default logger;
