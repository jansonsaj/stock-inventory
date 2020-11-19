import handlebars from 'handlebars'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PENCE_PER_POUND = 100
const POUND_DECIMAL_PLACES = 2

/**
 * Register all Handlebars partials in directory ../views/partials/
 * Use file name without extension as partial name
 */
export async function registerPartials() {
	const partialsFolder = path.join(__dirname, '../views/partials/')
	const fileNames = await fs.readdir(partialsFolder)
	fileNames.forEach(async fileName => {
		const file = await fs.readFile(path.join(partialsFolder, fileName))
		handlebars.registerPartial(
			fileName.substring(0, fileName.lastIndexOf('.')),
			file.toString()
		)
	})
}

/**
 * Register raw helper, which allows {{{{raw}}}} to be used
 * in handlebars templates to define an area that does not need
 * to be parsed. This can be used to parse templates on client-side.
 */
function registerRawHelper() {
	handlebars.registerHelper('raw', function(options) {
		return options.fn(this)
	})
}

/**
 * Register currency helper, which displays pence as pounds
 */
function registerCurrencyHelper() {
	handlebars.registerHelper('asPounds', (pence) => (pence / PENCE_PER_POUND).toFixed(POUND_DECIMAL_PLACES))
}

/**
 * Register stringify helper, which turns objects into strings
 */
function registerStringifyHelper() {
	handlebars.registerHelper('stringify', (object) => JSON.stringify(object))
}

/**
 * Register all custom helpers
 */
export function registerHelpers() {
	registerRawHelper()
	registerCurrencyHelper()
	registerStringifyHelper()
}
