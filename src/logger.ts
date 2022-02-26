import { crash } from '@firebase.config';
import toast from 'react-native-toast-message';

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

		if (typeof x === 'string') {
			toast.show({ type: 'error', text1: x });
		}

		if (x instanceof Error) {
			crash.recordError(x);
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
