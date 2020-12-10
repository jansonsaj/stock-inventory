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

/**
 * Checks wether a table exists in a database
 * @param {object} db Database instance
 * @param {string} tableName The name of the table
 * @return {boolean} True if the table exists
 */
export async function tableExists(db, tableName) {
	const sql = 'SELECT name FROM sqlite_master WHERE type=\'table\' AND name=?;'
	const data = await db.get(sql, tableName)
	return !!data
}
