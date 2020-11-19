/* main.js */
/* globals Handlebars */

const SUCCESS_STATUS = 200
const CLIENT_ERROR_STATUS = 400
const SERVER_ERROR_STATUS = 500

const DEFAULT_DELAY_MS = 2000

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
 * Shows a status message
 * @param {string} text Message text to display
 * @param {string} type Type for styling. Either 'info', 'success' or 'error'
 * @param {boolean} autoHide Whether to automatically hide the message
 */
function showMessage(text, type = 'info', autoHide = true) {
	const message = document.querySelector('.msg')
	message.innerHTML = text
	message.classList.remove('info', 'success', 'error')
	message.classList.add(type)
	message.hidden = false
	if (autoHide) {
		hideMessage()
	}
}

/**
 * Hide the status message after a delay (default: 2 seconds)
 * @param {number} delay Amount in milliseconds to wait before hiding
 */
function hideMessage(delay = DEFAULT_DELAY_MS) {
	window.setTimeout(() => {
		document.querySelector('.msg').hidden = true
	}, delay)
}

/**
 * Adds an item to the specified list and displays it in a table
 * with a total at the bottom
 * @param {object[]} items List of items to add to
 * @returns {function} Returns a function that resolves with its input
 */
function addToList(items) {
	return (item) => {
		items.push(item)
		const context = {
			items,
			totalPrice: items.reduce((acc, obj) => acc + obj.retail_price, 0)
		}
		document.querySelector('input[name=items]').value = JSON.stringify(items)
		document.querySelector('input[name=totalPrice]').value = context.totalPrice
		document.querySelector('input[type=submit]').disabled = false

		const template = document.querySelector('#item-list-template').innerHTML
		const renderItemList = Handlebars.compile(template)
		document.querySelector('#item-list').innerHTML = renderItemList(context)

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
	displayValueIfExists('#item-wholesale-price', item.wholesale_price)
	displayValueIfExists('#item-retail-price', item.retail_price)
	displayValueIfExists('#item-max-stock', item.max_stock)
	displayValueIfExists('#item-min-stock', item.min_stock)
	displayValueIfExists('#item-stock', item.stock)
	displayValueIfExists('#item-barcode', item.barcode)
	showMessage('Item displayed', 'success')
}

/**
 * Adds an action on form reset, that clears the scanned items
 * and empties the provided list of items
 * @param {object[]} items List of items
 */
function addFormResetAction(items) {
	document.querySelector('form').addEventListener('reset', () => {
		document.querySelector('#item').hidden = true
		document.querySelector('#item-list').innerHTML = ''
		document.querySelector('input[name=items]').value = ''
		document.querySelector('input[name=totalPrice]').value = ''
		document.querySelector('input[type=submit]').disabled = true
		items.splice(0, items.length)
	})
}


window.addEventListener('DOMContentLoaded', () => {
	hideMessage()
	const items = []

	const barcodeScannerInput = document.querySelector('#barcode-scanner')
	barcodeScannerInput.addEventListener('keyup', event => {
		if (event.key !== 'Enter') return
		if (!barcodeScannerInput.value.trim()) return

		fetch(`${window.location.origin}/inventory/item/${barcodeScannerInput.value.trim()}`)
			.then(checkStatus)
			.then(addToList(items))
			.then(displayItem)
			.catch(err => showMessage(err.message, 'error'))

		barcodeScannerInput.value = ''
		console.log(items)
	})

	addFormResetAction(items)
})
