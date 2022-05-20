import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import tw from '@tw';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
interface Props {
	displayingGuestInfo: boolean;
}

/**
 * Modal displaying info about signin in as guest.
 * Render when user press Question mark icon
 */
const GuestInfo: FC<Props> = ({ displayingGuestInfo }) => {
	return (
		<View
			style={tw(
				'flex flex-col justify-center items-center w-full mx-auto mt-4'
			)}
		>
			{displayingGuestInfo && (
				<View style={tw('border border-denison-red rounded-2xl p-3')}>
					<Text>For non-Denison guests trying out the application</Text>
					<View style={tw('flex flex-row items-start pl-3 pt-3')}>
						<FontAwesomeIcon icon={faCircle} size={8} style={tw('mr-2 mt-1')} />
						<Text>Can view items being sold (refered to as "listings")</Text>
					</View>
					<View style={tw('flex flex-row items-start pl-3 pt-3')}>
						<FontAwesomeIcon icon={faCircle} size={8} style={tw('mr-2 mt-1')} />
						<Text>Can create listings, but only visible to other guests</Text>
					</View>
					<View style={tw('flex flex-row items-start pl-3 pt-3')}>
						<FontAwesomeIcon icon={faCircle} size={8} style={tw('mr-2 mt-1')} />
						<Text>Can only interact with other guests' listings</Text>
					</View>
					<View style={tw('flex flex-row items-start pl-3 pt-3')}>
						<FontAwesomeIcon icon={faCircle} size={8} style={tw('mr-2 mt-1')} />
						<Text>Can only view core team members' profile</Text>
					</View>
					<View style={tw('flex flex-row items-start pl-3 pt-3')}>
						<FontAwesomeIcon icon={faCircle} size={8} style={tw('mr-2 mt-1')} />
						<Text>Can only send message to core team members</Text>
					</View>
					<View style={tw('flex flex-row items-start pl-3 pt-3')}>
						<FontAwesomeIcon icon={faCircle} size={8} style={tw('mr-2 mt-1')} />
						<Text>Account will be deleted after 1 month</Text>
					</View>
				</View>
			)}
		</View>
	);
};

export default GuestInfo;
