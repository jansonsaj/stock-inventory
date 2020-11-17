import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function loadSqlScript(scriptName) {
	const fileLocation = path.join(__dirname, '../scripts', scriptName)
	const sqlFile = await fs.readFile(fileLocation)
	return sqlFile.toString()
}
