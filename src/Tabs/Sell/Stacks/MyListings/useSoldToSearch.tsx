import React, { useState } from 'react';
import { ListingData, UserInfo } from 'types';

export type UseSoldToSearch = () => {
	showingSearch: boolean;
	setShowingSearch: React.Dispatch<React.SetStateAction<boolean>>;
	selectedListingData: ListingData | null | undefined;
	setSelectedListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>;
	selectedSoldTo: UserInfo | null | undefined;
	setSelectedSoldTo: React.Dispatch<
		React.SetStateAction<UserInfo | null | undefined>
	>;
};

const useSoldToSearch: UseSoldToSearch = () => {
	const [showingSearch, setShowingSearch] = useState<boolean>(false);

	// data selected listing to mark as sold
	const [selectedListingData, setSelectedListingData] = useState<
		ListingData | null | undefined
	>();

	// data of sold to user
	const [selectedSoldTo, setSelectedSoldTo] = useState<
		UserInfo | null | undefined
	>();
	return {
		showingSearch,
		setShowingSearch,
		selectedListingData,
		setSelectedListingData,
		selectedSoldTo,
		setSelectedSoldTo,
	};
};

export default useSoldToSearch;
