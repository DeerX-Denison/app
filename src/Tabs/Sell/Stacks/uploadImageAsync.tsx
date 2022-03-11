import { storage } from '@firebase.config';
import logger from '@logger';
import 'react-native-get-random-values';
import { ListingId, ListingImageMetadata, ListingImageURL } from 'types';
import { v4 as uuidv4 } from 'uuid';

/**
 * upload image to cloud storage from input localUrl and return its public url
 */
const uploadImageAsync = async (
	localUrl: ListingImageURL,
	listingId: ListingId,
	sellerId: string,
	numImages: number,
	progressArray: number[],
	setProgressArray: React.Dispatch<React.SetStateAction<number[]>>,
	index: number
) => {
	try {
		const imgBlob = await (await fetch(localUrl)).blob();
		const imgPaths = localUrl.split('/');
		const imgName = imgPaths[imgPaths.length - 1];
		const imgExt = imgName.substring(imgName.indexOf('.') + 1);
		const newImgName = uuidv4();
		const imgId = `${newImgName}.${imgExt}`;
		const metadata: ListingImageMetadata = {
			uploader: sellerId,
			listingId: listingId,
			imageId: imgId,
			resized: 'false',
			contentValidated: 'false',
		};
		const imageRef = `listings/${listingId}/${imgId}`;

		const uploadTask = storage.ref(imageRef).put(imgBlob, {
			customMetadata: metadata,
		});
		const publicUrl = await new Promise<ListingImageURL>((res, rej) => {
			uploadTask.on(
				'state_changed',
				(snap) => {
					const subProgress =
						snap.bytesTransferred / snap.totalBytes / numImages;
					const clone = progressArray.map((x) => x);
					clone[index] = subProgress;
					setProgressArray(clone);
				},
				(error) => {
					logger.log(`${error.code} - ${error.message}`);
					rej(error.message);
				},
				async () => {
					if (uploadTask.snapshot) {
						const publicUrl: ListingImageURL = (
							await uploadTask.snapshot.ref.getDownloadURL()
						).toString();
						res(publicUrl);
					}
				}
			);
		});
		return publicUrl;
	} catch (error) {
		logger.log(error);
		throw new Error('Cannot upload image');
	}
};

/**
 * upload input array of image to cloud storage and return their public urls
 */
const uploadImagesAsync = async (
	images: ListingImageURL[],
	listingId: ListingId,
	sellerId: string,
	progressArray: number[],
	setProgressArray: React.Dispatch<React.SetStateAction<number[]>>
) => {
	const newImages = images.filter((x) => !x.startsWith('http'));
	const oldUrls = images.filter((x) => x.startsWith('http'));
	const newUrls = await Promise.all(
		newImages.map(async (url, index) => {
			const publicUrl = await uploadImageAsync(
				url,
				listingId,
				sellerId,
				newImages.length,
				progressArray,
				setProgressArray,
				index
			);
			return publicUrl;
		})
	);
	const uploadedUrls = [...oldUrls, ...newUrls];
	return uploadedUrls;
};

export default uploadImagesAsync;
