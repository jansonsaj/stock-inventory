/* image-upload.js */

/**
 * Client-side script for uploading images
 * @module public/js/image-upload
 */
import { showMessage } from './main.js'
import { checkStatus } from './utils.js'

/**
 * Enable the submit button of the form
 */
export function enableSubmitButton() {
	document.querySelector('input[type=submit]').disabled = false
}

/**
 * Disable the submit button of the form
 */
export function disableSubmitButton() {
	document.querySelector('input[type=submit]').disabled = true
}

/**
 * When a user selects an image using the photo input element,
 * upload and display this image
 */
export function setUpImageUpload() {
	const photoInput = document.querySelector('#photoInput')
	photoInput.addEventListener('change', async() => {
		if (photoInput.files[0]) {
			uploadImage(photoInput.files[0])
		} else {
			removeImage()
		}
	})
}

/**
 * Upload image and get uploaded image's location
 * @param {file} image Image file to upload
 */
function uploadImage(image) {
	disableSubmitButton()
	const formData = new FormData()
	formData.append('image', image)

	const options = {
		method: 'POST',
		body: formData,
	}

	fetch('/images', options)
		.then(checkStatus)
		.then(imageSuccessfullyUploaded)
		.catch(err => showMessage(err.message, 'error'))
		.finally(enableSubmitButton)
}

/**
 * Display the uploaded image and put the URL in the photo input element
 * @param {string} imageLocation The URL to access uploaded image
 */
function imageSuccessfullyUploaded({imageLocation}) {
	document.querySelector('#photoDisplay').src = imageLocation
	document.querySelector('input[name=photo]').value = imageLocation
}

/**
 * Remove the displayed image and the URL from the photo input element
 */
export function removeImage() {
	document.querySelector('#photoDisplay').src = ''
	document.querySelector('input[name=photo]').value = ''
}
