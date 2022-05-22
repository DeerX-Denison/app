import React, { useEffect, useState } from 'react';
import { ListingId, MyListingData } from 'types';

export type UseShowingMenu = (
	myListings: MyListingData[] | null | undefined
) => {
	showingMenu: { [listingId: string]: boolean };
	setShowingMenu: React.Dispatch<
		React.SetStateAction<{ [listingId: string]: boolean }>
	>;
	toggleMenu: (listingId: ListingId) => void;
	turnOffAllMenu: () => void;
};

// custom hook to compute array of showing menu on each my listing
const useShowingMenu: UseShowingMenu = (myListings) => {
	const [showingMenu, setShowingMenu] = useState<{
		[listingId: string]: boolean;
	}>({});

	useEffect(() => {
		if (myListings && myListings.length > 0) {
			const showingMenu: { [listingId: string]: boolean } = {};
			myListings.forEach((listingData) => {
				showingMenu[listingData.id] = false;
			});
			setShowingMenu(showingMenu);
		}
	}, [myListings]);

	const toggleMenu = (listingId: ListingId) => {
		const _showingMenu = { ...showingMenu };
		for (const id in _showingMenu) {
			if (id !== listingId) {
				_showingMenu[id] = false;
			} else {
				_showingMenu[id] = !_showingMenu[id];
			}
		}
		setShowingMenu(_showingMenu);
	};

	const turnOffAllMenu = () => {
		const _showingMenu = { ...showingMenu };
		for (const id in _showingMenu) {
			_showingMenu[id] = false;
		}
		setShowingMenu(_showingMenu);
	};

	return { showingMenu, setShowingMenu, toggleMenu, turnOffAllMenu };
};

export default useShowingMenu;
