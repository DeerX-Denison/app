import React, { useState } from 'react';

export type UseSoldToSearch = () => {
	showingSearch: boolean;
	setShowingSearch: React.Dispatch<React.SetStateAction<boolean>>;
	selectedListingId: string | undefined;
	setSelectedListingId: React.Dispatch<
		React.SetStateAction<string | undefined>
	>;
};

const useSoldToSearch: UseSoldToSearch = () => {
	const [showingSearch, setShowingSearch] = useState<boolean>(false);

	// id of selected listing to mark as sold
	const [selectedListingId, setSelectedListingId] = useState<
		string | undefined
	>();
	return {
		showingSearch,
		setShowingSearch,
		selectedListingId,
		setSelectedListingId,
	};
};

export default useSoldToSearch;
