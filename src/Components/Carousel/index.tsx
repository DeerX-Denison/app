import tw from '@tw';
import React, { FC, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import RNCarousel, { Pagination } from 'react-native-snap-carousel';
import { ListingErrors } from 'src/Hooks/useListingError';
import { CarouselData, ListingData } from '../../types';
import CarouselItem from './CarouselItem';

interface Props {
	listingData: ListingData | null | undefined;
	setListingData: React.Dispatch<
		React.SetStateAction<ListingData | null | undefined>
	>;
	editMode: boolean;
	listingErrors?: ListingErrors;
}

const Carousel: FC<Props> = ({
	listingData,
	setListingData,
	editMode,
	listingErrors,
}) => {
	const carouselRef = useRef<RNCarousel<CarouselData>>(null);
	const [index, setIndex] = useState<number>(0);
	const { width } = useWindowDimensions();
	return (
		<>
			<View style={tw('relative')}>
				<RNCarousel
					layout="default"
					ref={carouselRef}
					data={listingData ? listingData.images : []}
					initialScrollIndex={0}
					renderItem={(item: { item: string; index: number }) => (
						<CarouselItem
							item={item.item}
							index={index}
							setIndex={setIndex}
							editMode={editMode}
							listingData={listingData}
							setListingData={setListingData}
							listingErrors={listingErrors}
						/>
					)}
					sliderWidth={width}
					itemWidth={width}
					inactiveSlideShift={0}
					onSnapToItem={(index) => setIndex(index)}
					useScrollView={true}
				/>

				<View style={tw('absolute -bottom-4 w-full')}>
					<View style={tw('flex justify-center items-center')}>
						<Pagination
							dotsLength={listingData ? listingData.images.length : 0}
							activeDotIndex={index}
							carouselRef={carouselRef as any}
							dotStyle={{
								width: 8,
								height: 8,
								borderRadius: 4,
								marginHorizontal: -2,
								backgroundColor: 'rgba(255, 255, 255, 1)',
							}}
							inactiveDotOpacity={0.6}
							inactiveDotScale={1}
							tappableDots={true}
						/>
					</View>
				</View>
			</View>
		</>
	);
};

export default Carousel;
