import React, { useEffect, useState } from 'react';
import { ListingData } from 'types';

export type UseShowingSoldToView = (
	listingData: ListingData | null | undefined
) => {
	showingSoldTo: boolean;
	setShowingSoldTo: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * custom hook to determine showingSoldTo state to render
 * SoldToSearch next to status selection box when user select "sold" status
 */
const useShowingSoldToView: UseShowingSoldToView = (listingData) => {
	const [showingSoldTo, setShowingSoldTo] = useState<boolean>(false);
	useEffect(() => {
		if (listingData && listingData.status === 'sold') {
			setShowingSoldTo(true);
		} else {
			setShowingSoldTo(false);
		}
	}, [listingData]);

	return { showingSoldTo, setShowingSoldTo };
};

export default useShowingSoldToView;
