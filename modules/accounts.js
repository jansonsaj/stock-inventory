
import bcrypt from 'bcrypt-promise'
import sqlite from 'sqlite-async'
import { loadSqlScript } from '../helpers/sql-loader.js'

const saltRounds = 10

class Accounts {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = await loadSqlScript('users.sql')
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * registers a new user
	 * @param {String} user the chosen username
	 * @param {String} pass the chosen password
	 * @returns {Boolean} returns true if the new user has been added
	 */
	async register(user, pass, email) {
		Array.from(arguments).forEach(val => {
			if (val.length === 0) throw new Error('missing field')
		})
		let sql = 'SELECT COUNT(id) as records FROM users WHERE user = ?;'
		const data = await this.db.get(sql, user)
		if (data.records !== 0) throw new Error(`username "${user}" already in use`)
		sql = 'SELECT COUNT(id) as records FROM users WHERE email = ?;'
		const emails = await this.db.get(sql, email)
		if (emails.records !== 0) throw new Error(`email address "${email}" is already in use`)
		pass = await bcrypt.hash(pass, saltRounds)
		sql = 'INSERT INTO users(user, pass, email) VALUES(?, ?, ?)'
		await this.db.run(sql, user, pass, email)
		return true
	}

	/**
	 * checks to see if a set of login credentials are valid
	 * @param {String} username the username to check
	 * @param {String} password the password to check
	 * @returns {Boolean} returns true if credentials are valid
	 */
	async login(username, password) {
		let sql = 'SELECT count(id) AS count FROM users WHERE user = ?;'
		const records = await this.db.get(sql, username)
		if (!records.count) throw new Error(`username "${username}" not found`)
		sql = 'SELECT pass FROM users WHERE user = ?;'
		const record = await this.db.get(sql, username)
		const valid = await bcrypt.compare(password, record.pass)
		if (valid === false) throw new Error(`invalid password for account "${username}"`)
		return true
	}

	async close() {
		await this.db.close()
	}
}

export { Accounts }
