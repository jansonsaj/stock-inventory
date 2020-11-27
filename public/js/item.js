/* item-details.js */

import { showMessage } from './main.js'
import { checkStatus } from './utils.js'

/**
 * When an item is successfully updated redirect to the new details url
 * and display a success message
 * @param {string} newBArcode The updated barcode of the item
 */
function itemSuccessfullyUpdated(newBarcode) {
	return () => {
		window.location.href = `/inventory/items/${newBarcode}?msg=Item successfully updated`
	}
}

/**
 * Overrides default form submit to stay on the same page.
 */
function setUpFormSubmit() {
	const form = document.querySelector('form')
	form.addEventListener('submit', event => {
		event.preventDefault()
		const updatedItem = new FormData(form)
		const newBarcode = updatedItem.get('barcode')

		const options = {
			method: 'PUT',
			body: updatedItem
		}

		fetch(`/api/inventory/items/${form.getAttribute('item-barcode')}`, options)
			.then(checkStatus)
			.then(itemSuccessfullyUpdated(newBarcode))
			.catch(err => showMessage(err.message, 'error'))
	})
}

window.addEventListener('DOMContentLoaded', setUpFormSubmit)
