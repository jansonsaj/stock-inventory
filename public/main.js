/* main.js */

const SUCCESS_STATUS = 200
const CLIENT_ERROR_STATUS = 400
const SERVER_ERROR_STATUS = 500

const DEFAULT_DELAY_MS = 2000

const PENCE_PER_POUND = 100
const POUND_DECIMAL_PLACES = 2

/**
 * Represent pence in equivalent pounds
 * @param {number} pence Amount in pence
 * @return {string} String representation of the pence in pounds
 */
function penceToPounds(pence) {
	return (pence / PENCE_PER_POUND).toFixed(POUND_DECIMAL_PLACES)
}

/**
 * Checks whether fetch() returned a successful message
 * @param {object} response Fetch response
 * @returns {Promise<object>} If successful returns response JSON
 * @throws If unsuccessful throws an error
 */
async function checkStatus(response) {
	if (response.status >= SUCCESS_STATUS && response.status < CLIENT_ERROR_STATUS) {
		return response.json()
	}
	if (response.status >= CLIENT_ERROR_STATUS && response.status < SERVER_ERROR_STATUS) {
		throw new Error(await response.text())
	}
	throw new Error('An error ocurred')
}

/**
/**
 * Adds an item to the specified list
 * @param {object[]} list List to add to
 * @returns {function} Returns a function that resolves with its input
 */
function addToList(list) {
	return (item) => {
		list.push(item)
		return Promise.resolve(item)
	}
}

/**
 * If element exists, set its inner HTML value
 * @param {string} querySelector Element's query selector
 * @param {string} value Inner HTML value to set
 */
function displayValueIfExists(querySelector, value) {
	const element = document.querySelector(querySelector)
	if (element) {
		element.innerHTML = value
	}
}

/**
 * Display image if src param is present. Hide it otherwise
 * @param {string} querySelector "img" element's query selector
 * @param {string} src Image source
 * @param {string} alt Alt text
 */
function displayImage(querySelector, src, alt) {
	const image = document.querySelector(querySelector)
	if (image) {
		if (src) {
			image.src = src
			image.alt = alt
			image.hidden = false
		} else {
			image.hidden = true
		}
	}
}

/**
 * Displays the item details
 * @param {object} item Item from inventory
 */
function displayItem(item) {
	const itemSection = document.querySelector('#item')
	if (itemSection) {
		itemSection.hidden = false
	}
	displayImage('#item-photo', item.photo, item.name)
	displayValueIfExists('#item-name', item.name)
	displayValueIfExists('#item-description', item.description)
	displayValueIfExists('#item-wholesale-price', penceToPounds(item.wholesale_price))
	displayValueIfExists('#item-retail-price', penceToPounds(item.retail_price))
	displayValueIfExists('#item-max-stock', item.max_stock)
	displayValueIfExists('#item-min-stock', item.min_stock)
	displayValueIfExists('#item-stock', item.stock)
	displayValueIfExists('#item-barcode', item.barcode)
}


window.addEventListener('DOMContentLoaded', () => {
	const items = []

	const barcodeScannerInput = document.querySelector('#barcode-scanner')
	barcodeScannerInput.addEventListener('keyup', event => {
		if (event.key !== 'Enter') return
		if (!barcodeScannerInput.value.trim()) return

		fetch(`${window.location.origin}/inventory/item/${barcodeScannerInput.value.trim()}`)
			.then(checkStatus)
			.then(addToList(items))
			.then(displayItem)

		barcodeScannerInput.value = ''
	})
})
