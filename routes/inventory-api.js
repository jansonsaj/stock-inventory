/**
 * Inventory API router for managing items and returning JSON responses
 * @module routes/inventory-api
 */
import Router from 'koa-router'
import { requireAuth } from '../middlewares/auth.js'
import { Items } from '../modules/items.js'
import { dbName } from '../helpers/config.js'

const inventoryApiRouter = new Router({ prefix: '/api/inventory' })

inventoryApiRouter.use(requireAuth)

/**
 * The script to create an item.
 *
 * @name New item script
 * @route {POST} /api/inventory/items
 * @authentication This route requires authentication or will redirect to login page.
 * @bodyparam {Item} item The details of the item to create
 */
inventoryApiRouter.post('/items', async ctx => {
	try {
		const item = ctx.request.body
		if (!item) {
			ctx.status = 400
			ctx.body = 'You need to provide an item to insert'
			return
		}
		// Change stored prices from Pounds to Pence
		if (item.wholesale_price) item.wholesale_price *= 100
		if (item.retail_price) item.retail_price *= 100

		const items = await new Items(dbName)
		ctx.body = await items.insert(item)
		ctx.status = 201
	} catch (err) {
		ctx.body = err.message
		ctx.status = 400
	}
})

/**
 * The script to get the specific item as JSON.
 *
 * @name Item script
 * @route {GET} /api/inventory/items/:barcode
 * @authentication This route requires authentication or will redirect to login page.
 * @routeparam {String} :barcode is the barcode of the item
 */
inventoryApiRouter.get('/items/:barcode', async ctx => {
	try {
		const items = await new Items(dbName)
		const item = await items.findByBarcode(ctx.params.barcode)
		if (!item) {
			ctx.body = `There is no item with barcode ${ctx.params.barcode}`
			ctx.status = 404
		} else {
			ctx.body = item
		}
	} catch (err) {
		ctx.body = err.message
		ctx.status = 400
	}
})

/**
 * The script to restock a specific item.
 *
 * @name Item restock script
 * @route {POST} /api/inventory/items/:barcode/restock
 * @authentication This route requires authentication or will redirect to login page.
 * @routeparam {String} :barcode is the barcode of the item
 * @bodyparam {number} count The count to increase the stock by
 */
inventoryApiRouter.post('/items/:barcode/restock', async ctx => {
	try {
		const items = await new Items(dbName)
		const item = await items.findByBarcode(ctx.params.barcode)
		if (!item) {
			ctx.body = `There is no item with barcode ${ctx.params.barcode}`
			ctx.status = 404
			return
		}
		if (!parseInt(ctx.request.body.count)) {
			ctx.body = 'You need to provide a count to restock'
			ctx.status = 400
			return
		}
		ctx.body = await items.addStock(ctx.params.barcode, parseInt(ctx.request.body.count))
	} catch (err) {
		ctx.body = err.message
		ctx.status = 400
	}
})

/**
 * The script to update an item.
 *
 * @name Update item script
 * @route {PUT} /api/inventory/items/:barcode
 * @authentication This route requires authentication or will redirect to login page.
 * @routeparam {String} :barcode is the barcode of the item to update
 * @bodyparam {Item} item The details of the item to create
 */
inventoryApiRouter.put('/items/:barcode', async ctx => {
	try {
		const items = await new Items(dbName)
		const item = await items.findByBarcode(ctx.params.barcode)
		if (!item) {
			ctx.body = `There is no item with barcode ${ctx.params.barcode}`
			ctx.status = 404
			return
		}
		const updatedItem = ctx.request.body
		// Change stored prices from Pounds to Pence
		if (updatedItem.wholesale_price) updatedItem.wholesale_price *= 100
		if (updatedItem.retail_price) updatedItem.retail_price *= 100

		Object.assign(item, updatedItem)
		await items.update(item, ctx.params.barcode)
		ctx.body = item
	} catch (err) {
		ctx.body = err.message
		ctx.status = 400
	}
})

export { inventoryApiRouter }
