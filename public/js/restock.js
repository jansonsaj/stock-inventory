/* restock.js */
/* globals Handlebars */

/**
 * Client-side script for restock page to restock new and existing items
 * @module public/js/restock
 */

import { showMessage } from './main.js'
import { checkStatus, SUCCESS_STATUS, NOT_FOUND_STATUS } from './utils.js'
import { setUpImageUpload } from './image-upload.js'

let defaultItemHtml

/**
 * Render a widget for adding stock to an existing item.
 * @param {object} item Item
 */
function showExistingItemWidget(item) {
	const template = document.querySelector('#existing-item-restock-template').innerHTML
	const renderExistingItem = Handlebars.compile(template)
	document.querySelector('#item').innerHTML = renderExistingItem(item)
}

/**
 * Render a widget for adding a new item with the scanned barcode.
 * @param {string} barcode Scanned barcode
 */
function showNewItemWidget(barcode) {
	const template = document.querySelector('#new-item-restock-template').innerHTML
	const renderNewItem = Handlebars.compile(template)
	document.querySelector('#item').innerHTML = renderNewItem({ barcode })
	setUpImageUpload()
}

/**
 * Reset elements when stock for an item gets updated
 */
function resetElements() {
	document.querySelector('#item').innerHTML = defaultItemHtml
	document.querySelector('#barcode-scanner').focus()
}

/**
 * Overrides default form submit to stay on the same page.
 * Uses the data, method and action specifiec in the form.
 */
function setUpFormSubmit() {
	const form = document.querySelector('form')
	form.addEventListener('submit', event => {
		event.preventDefault()

		const options = {
			method: form.method,
			body: new FormData(form)
		}

		fetch(form.action, options)
			.then(checkStatus)
			.then(resetElements)
			.catch(err => showMessage(err.message, 'error'))
	})
}

/**
 * Display restock widget for the item with the scanned barcode.
 * @param {string} barcode Scanned barcode
 */
function showRestockWidget(barcode) {
	return async(response) => {
		if (response.status === SUCCESS_STATUS) {
			showExistingItemWidget(await response.json())
		} else if (response.status === NOT_FOUND_STATUS) {
			showNewItemWidget(barcode)
		} else {
			throw new Error(await response.text())
		}
		document.querySelector('#item [autofocus]').focus()
		setUpFormSubmit()
	}
}

window.addEventListener('DOMContentLoaded', () => {
	defaultItemHtml = document.querySelector('#item').innerHTML

	const barcodeScannerInput = document.querySelector('#barcode-scanner')
	barcodeScannerInput.addEventListener('keyup', event => {
		if (event.key !== 'Enter') return
		const barcode = barcodeScannerInput.value.trim()
		if (!barcode) return

		fetch(`/api/inventory/items/${barcode}`)
			.then(showRestockWidget(barcode))
			.catch(err => showMessage(err.message, 'error'))

		barcodeScannerInput.value = ''
	})
})
