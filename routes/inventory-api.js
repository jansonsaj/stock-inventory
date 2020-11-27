
import Router from 'koa-router'
import { requireAuth } from '../middlewares/auth.js'
import { Items } from '../modules/items.js'
import { dbName } from '../helpers/config.js'

const inventoryApiRouter = new Router({ prefix: '/api/inventory' })

inventoryApiRouter.use(requireAuth)

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
