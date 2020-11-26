
import Router from 'koa-router'
import { requireAuth } from '../middlewares/auth.js'
import { Items } from '../modules/items.js'
import { dbName } from '../helpers/config.js'

const inventoryRouter = new Router({ prefix: '/inventory' })

inventoryRouter.use(requireAuth)

inventoryRouter.get('/', async ctx => {
	try {
		console.log(ctx.hbs)
		await ctx.render('inventory', ctx.hbs)
	} catch (err) {
		console.log(err)
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

inventoryRouter.post('/order-summary', async ctx => {
	try {
		const {items, totalPrice} = ctx.request.body
		const processedItems = Items.deduplicateAndCount(JSON.parse(items))
		ctx.hbs.items = processedItems
		ctx.hbs.totalPrice = totalPrice
		await ctx.render('order-summary', ctx.hbs)
	} catch (err) {
		console.log(err)
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

inventoryRouter.post('/complete-order', async ctx => {
	try {
		const items = await new Items(dbName)
		JSON.parse(ctx.request.body.items).forEach(item => {
			items.subtractStock(item.barcode, item.count)
		})
		await ctx.redirect('/inventory?msg=Order successfully completed')
	} catch (err) {
		console.log(err)
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

inventoryRouter.get('/restock', async ctx => {
	try {
		await ctx.render('restock', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

inventoryRouter.get('/new-item', async ctx => {
	try {
		await ctx.render('new-item', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

inventoryRouter.get('/all-items', async ctx => {
	try {
		const items = await new Items(dbName)
		ctx.hbs.items = await items.all()
		await ctx.render('all-items', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})
inventoryRouter.post('/items', async ctx => {
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

inventoryRouter.get('/items/:barcode', async ctx => {
	try {
		const items = await new Items(dbName)
		const item = await items.findByBarcode(ctx.params.barcode)
		if (!item) {
			ctx.status = 404
			ctx.body = `There is no item with barcode ${ctx.params.barcode}`
		} else {
			ctx.body = item
		}
	} catch (err) {
		ctx.status = 500
	}
})

inventoryRouter.post('/items/:barcode/restock', async ctx => {
	try {
		const items = await new Items(dbName)
		const item = await items.findByBarcode(ctx.params.barcode)
		if (!item) {
			ctx.status = 404
			ctx.body = `There is no item with barcode ${ctx.params.barcode}`
			return
		}
		const count = parseInt(ctx.request.body.count)
		if (!count) {
			ctx.status = 400
			ctx.body = 'You need to provide a count to restock'
			return
		}
		ctx.body = await items.addStock(ctx.params.barcode, count)
	} catch (err) {
		ctx.status = 500
	}
})

export { inventoryRouter }
