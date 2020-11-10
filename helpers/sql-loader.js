import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

export async function loadSqlScript(scriptName) {
	// @eslint-disable-next-line
	const __dirname = path.dirname(fileURLToPath(import.meta.url))
	const fileLocation = path.join(__dirname, '../scripts', scriptName)
	const sqlFile = await fs.readFile(fileLocation)
	return sqlFile.toString()
}
