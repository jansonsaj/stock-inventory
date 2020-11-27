
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

inventoryRouter.get('/items-to-order', async ctx => {
	try {
		const items = await new Items(dbName)
		const itemsToOrder = await items.needOrdering()
		ctx.hbs.items = itemsToOrder
		ctx.hbs.totalOrderPrice = itemsToOrder
			.reduce((acc, obj) => acc + obj.order_price, 0)
		console.log(ctx.hbs)
		await ctx.render('items-to-order', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

export { inventoryRouter }
