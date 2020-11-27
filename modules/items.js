
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
	 * @throws {Error} When barcode is empty
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
	 * @throws {Error} When item's barcode is empty or already in use
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
	 * @throws {Error} When item with the specified barcode doesn't exist
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
	 * @throws {Error} When item with the specified barcode doesn't exist
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

	async needOrdering() {
		const sql = 'SELECT * FROM items WHERE stock < min_stock;'
		const items = await this.db.all(sql)
		return items.map(item => {
			const orderCount = item.max_stock - item.stock
			return {
				...item,
				order_count: orderCount,
				order_price: item.wholesale_price * orderCount
			}
		})
	}

	/**
	 * Updates an existing item
	 * @param {object} item Item object
	 * @param {string} barcode The original barcode for the item
	 * @returns {boolean} Returns true if item was successfully updated
	 * @throws {Error} When the barcode is changed to a non-unique one
	 */
	async update(item, barcode) {
		if (item.barcode !== barcode && await this.findByBarcode(item.barcode)) {
			throw new Error(`an item with the barcode "${item.barcode}" already exists`)
		}
		const sql = `UPDATE items SET
				barcode = ?, name = ?, description = ?, wholesale_price = ?,
				retail_price = ?, max_stock = ?, min_stock = ?, stock = ?, photo = ?
			WHERE barcode = ?`
		await this.db.run(sql, item.barcode, item.name, item.description, item.wholesale_price,
			item.retail_price, item.max_stock, item.min_stock, item.stock, item.photo, barcode)
		return true
	}

	async close() {
		await this.db.close()
	}

	/**
	 * Counts occurrances of each item and removes duplicates
	 * and provides a total cost of duplicated items
	 * @param {object[]} items Item array
	 * @return {object[]} Returns items array without duplicates and with count
	 */
	static deduplicateAndCount(items) {
		const itemMap = {}
		items.forEach((item) => {
			if(itemMap[item.barcode]) {
				itemMap[item.barcode].count += 1
				itemMap[item.barcode].total_retail_price += item.retail_price
				itemMap[item.barcode].total_wholesale_price += item.wholesale_price
			} else {
				itemMap[item.barcode] = item
				itemMap[item.barcode].count = 1
				itemMap[item.barcode].total_retail_price = item.retail_price
				itemMap[item.barcode].total_wholesale_price = item.wholesale_price
			}
		})
		return Object.values(itemMap)
	}
}

export { Items }
