
import sqlite from 'sqlite-async'
import { loadSqlScript } from '../helpers/sql-loader.js'

class Items {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const createTableSql = await loadSqlScript('items.sql')
			await this.db.run(createTableSql)
			return this
		})()
	}

	/**
	 * Get a list of all items
	 * @returns {object[]} Returns array of all items
	 */
	async all() {
		const sql = 'SELECT * FROM items;'
		return await this.db.all(sql)
	}

	/**
	 * Get an item by its barcode
	 * @param {string} barcode Item's barcode
	 * @returns {object} Returns item that matches the barcode or undefined
	 */
	async findByBarcode(barcode) {
		if (!barcode) {
			throw new Error('barcode can\'t be empty')
		}
		const sql = 'SELECT * FROM items WHERE barcode = ?;'
		return await this.db.get(sql, barcode)
	}

	/**
	 * Inserts a new item
	 * @param {object} item Item object
	 * @returns {boolean} Returns true if item was successfully inserted
	 */
	async insert(item) {
		if (!item || !item.barcode) {
			throw new Error('barcode can\'t be empty')
		}
		let sql = 'SELECT * FROM items WHERE barcode = ?;'
		const data = await this.db.get(sql, item.barcode)
		if (data) {
			throw new Error(`barcode "${item.barcode}" already in use`)
		}
		sql = `INSERT INTO items(barcode, name, description, wholesale_price,
			retail_price, max_stock, min_stock, stock, photo)
			VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);`
		await this.db.run(sql, item.barcode, item.name, item.description, item.wholesale_price,
			item.retail_price, item.max_stock, item.min_stock, item.stock, item.photo)
		return true
	}

	/**
	 * Increases item's stock by the specified count
	 * @param {string} barcode Item's barcode
	 * @param {number} count The count to increase the stock by
	 * @returns {boolean} Returns true if the stock was successfully updated
	 */
	async addStock(barcode, count) {
		const item = await this.findByBarcode(barcode)
		if (!item) {
			throw new Error(`item with the barcode "${barcode}" does not exist`)
		}
		const sql = 'UPDATE items SET stock = stock + ? WHERE barcode = ?;'
		await this.db.run(sql, count, barcode)
		return true
	}

	/**
	 * Decreases item's stock by the specified count
	 * @param {string} barcode Item's barcode
	 * @param {number} count The count to decrease the stock by
	 * @returns {boolean} Returns true if the stock was successfully updated
	 */
	async subtractStock(barcode, count) {
		const item = await this.findByBarcode(barcode)
		if (!item) {
			throw new Error(`item with the barcode "${barcode}" does not exist`)
		}
		const sql = 'UPDATE items SET stock = stock - ? WHERE barcode = ?;'
		await this.db.run(sql, count, barcode)
		return true
	}

	async close() {
		await this.db.close()
	}
}

export { Items }
