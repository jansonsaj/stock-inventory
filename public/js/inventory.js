/* inventory.js */
/* globals Handlebars */

import { showMessage } from './main.js'
import { checkStatus } from './utils.js'

/** Keep a list of all scanned items */
const items = []

/**
 * Calculate the sum of retail price from all scanned items
 * @return {number} Returns the sum of scanned item retail prices
 */
function calculateTotalPrice() {
	return items.reduce((acc, obj) => acc + obj.retail_price, 0)
}

/**
 * Adds an item to the specified list and displays it in a table
 * with a total at the bottom
 * @returns {Promise<object>} Returns a promise that resolves with the item
 */
function addToList(item) {
	items.push(item)
	const context = {
		items,
		totalPrice: calculateTotalPrice()
	}
	document.querySelector('input[name=items]').value = JSON.stringify(items)
	document.querySelector('input[name=totalPrice]').value = context.totalPrice
	document.querySelector('input[type=submit]').disabled = false

	const template = document.querySelector('#item-list-template').innerHTML
	const renderItemList = Handlebars.compile(template)
	document.querySelector('#item-list').innerHTML = renderItemList(context)

	return Promise.resolve(item)
}

/**
 * Displays the item details
 * @param {object} item Item from inventory
 */
function displayItem(item) {
	const template = document.querySelector('#scanned-item-template').innerHTML
	const renderItem = Handlebars.compile(template)
	document.querySelector('#item').innerHTML = renderItem(item)
}

window.addEventListener('DOMContentLoaded', () => {
	const barcodeScannerInput = document.querySelector('#barcode-scanner')
	barcodeScannerInput.addEventListener('keyup', event => {
		if (event.key !== 'Enter') return
		const barcode = barcodeScannerInput.value.trim()
		if (!barcode) return

		fetch(`${window.location.origin}/inventory/items/${barcode}`)
			.then(checkStatus)
			.then(addToList)
			.then(displayItem)
			.catch(err => showMessage(err.message, 'error'))

		barcodeScannerInput.value = ''
	})
})
