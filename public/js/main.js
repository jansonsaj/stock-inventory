/* main.js */

import './register-helpers.js'

const DEFAULT_DELAY_MS = 2000
let timeout

/**
 * Shows a status message
 * @param {string} text Message text to display
 * @param {string} type Type for styling. Either 'info', 'success' or 'error'
 * @param {boolean} autoHide Whether to automatically hide the message
 */
export function showMessage(text, type = 'info', autoHide = true) {
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
export function hideMessage(delay = DEFAULT_DELAY_MS) {
	if (timeout) {
		window.clearTimeout(timeout)
	}
	timeout = window.setTimeout(() => {
		document.querySelector('.msg').hidden = true
	}, delay)
}

window.addEventListener('DOMContentLoaded', () => {
	hideMessage()
})
