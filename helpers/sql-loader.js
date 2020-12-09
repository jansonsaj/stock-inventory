/**
 * Helper module for loading SQL files
 * @module helpers/sql-loader
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Loads the contents of the requested SQL script file
 * @param {string} scriptName The name of the SQL scripts relative to /scripts directory
 * @return {string} The contents of the SQL file
 */
export async function loadSqlScript(scriptName) {
	const fileLocation = path.join(__dirname, '../scripts', scriptName)
	const sqlFile = await fs.readFile(fileLocation)
	return sqlFile.toString()
}
