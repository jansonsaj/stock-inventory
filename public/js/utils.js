/* utils.js */

export const SUCCESS_STATUS = 200
export const NOT_FOUND_STATUS = 404
export const CLIENT_ERROR_STATUS = 400
export const SERVER_ERROR_STATUS = 500

/**
* Checks whether fetch() returned a successful message
* @param {object} response Fetch response
* @returns {Promise<object>} If successful returns response JSON
* @throws If unsuccessful throws an error
*/
export async function checkStatus(response) {
	if (response.status >= SUCCESS_STATUS && response.status < CLIENT_ERROR_STATUS) {
		return response.json()
	}
	if (response.status >= CLIENT_ERROR_STATUS && response.status < SERVER_ERROR_STATUS) {
		throw new Error(await response.text())
	}
	throw new Error('An error ocurred')
}
