import { storage } from '@firebase.config';
import logger from '@logger';
import React from 'react';
import 'react-native-get-random-values';
import { ListingImageURL, ProfilePhotoMetadata, ProfilePhotoURL } from 'types';

/**
 * upload image to cloud storage from input localUrl and return its public url
 */
const uploadImageAsync = async (
	localUrl: ProfilePhotoURL,
	uid: string,
	progress: number,
	setProgress: React.Dispatch<React.SetStateAction<number>>
) => {
	try {
		if (localUrl.startsWith('http'))
			throw 'Invalid argument: localURL starts with http';
		const imgBlob = await (await fetch(localUrl)).blob();
		const imgPaths = localUrl.split('/');
		const imgName = imgPaths[imgPaths.length - 1];
		const imgExt = imgName.substring(imgName.indexOf('.') + 1);
		const imgId = `${uid}.${imgExt}`;
		const metadata: ProfilePhotoMetadata = {
			uploaderUid: uid,
			imgId,
			resized: 'false',
			contentValidated: 'false',
		};
		const imageRef = `profilePhotos/${uid}/${imgId}`;

		const uploadTask = storage.ref(imageRef).put(imgBlob, {
			customMetadata: metadata,
		});
		const publicUrl = await new Promise<ListingImageURL>((res, rej) => {
			uploadTask.on(
				'state_changed',
				(snap) => {
					const progress = snap.bytesTransferred / snap.totalBytes;
					setProgress(progress);
				},
				(error) => {
					logger.log(`${error.code} - ${error.message}`);
					rej(error.message);
				},
				async () => {
					if (uploadTask.snapshot) {
						const publicUrl: ProfilePhotoURL = (
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

export default uploadImageAsync;
