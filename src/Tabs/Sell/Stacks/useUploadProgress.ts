import React, { useEffect, useState } from 'react';

export type UseUploadProgressFn = () => {
	subProgressArray: number[];
	setSubProgressArray: React.Dispatch<React.SetStateAction<number[]>>;
	progressArray: number[];
	setProgressArray: React.Dispatch<React.SetStateAction<number[]>>;
	progress: number;
	setProgress: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * custom hook to handle multiple async uploads and sum it into "progress" state
 */
const useUploadProgress: UseUploadProgressFn = () => {
	const [subProgressArray, setSubProgressArray] = useState<number[]>([]);
	const [progressArray, setProgressArray] = useState<number[]>([]);
	const [progress, setProgress] = useState(0);
	/**
	 * effect to parse multiple updated subProgressArray into one progressArray
	 */
	useEffect(() => {
		const index = subProgressArray.findIndex((x) => x !== undefined);
		const val = subProgressArray[index];
		const clone = progressArray.map((x) => x);
		clone[index] = val;
		setProgressArray(clone);
	}, [subProgressArray]);

	useEffect(() => {
		setProgress(progressArray.reduce((a, b) => a + b, 0));
	}, [progressArray]);

	return {
		subProgressArray,
		setSubProgressArray,
		progressArray,
		setProgressArray,
		progress,
		setProgress,
	};
};
export default useUploadProgress;
