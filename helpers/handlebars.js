import handlebars from 'handlebars'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
