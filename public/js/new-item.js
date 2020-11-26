/* new-item.js */

import { showMessage } from './main.js'
import { checkStatus } from './utils.js'

/**
 * When an item is successfully added, reset the form
 * and display a success message
 */
function itemSuccessfullyAdded() {
	showMessage('Item successfully added', 'success')
	document.querySelector('form').reset()
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
			.then(itemSuccessfullyAdded)
			.catch(err => showMessage(err.message, 'error'))
	})
}

window.addEventListener('DOMContentLoaded', setUpFormSubmit)
