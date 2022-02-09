import { useEffect } from 'react';

/**
 * function to generate a debounced version of an input version
 */
const debounce = <A = unknown, R = void>(
	func: (args: A) => R,
	delayInMs: number
): [(args: A) => Promise<R>, () => void] => {
	let timer: NodeJS.Timeout;

	const debouncedFunc = (args: A): Promise<R> =>
		new Promise((resolve) => {
			if (timer) {
				clearTimeout(timer);
			}

			timer = setTimeout(() => {
				resolve(func(args));
			}, delayInMs);
		});

	const teardown = () => clearTimeout(timer);

	return [debouncedFunc, teardown];
};

/**
 * custom hook to generate debounce function of an input function
 */
const useDebounce = <A = unknown, R = void>(
	func: (args: A) => R,
	delayInMs: number
): ((args: A) => Promise<R>) => {
	const [debouncedFun, teardown] = debounce<A, R>(func, delayInMs);

	useEffect(() => () => teardown(), []);

	return debouncedFun;
};

export default useDebounce;
