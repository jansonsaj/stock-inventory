
import Router from 'koa-router'
import { requireAuth } from '../middlewares/auth.js'
import { Items } from '../modules/items.js'
import { dbName } from '../helpers/config.js'

const inventoryRouter = new Router({ prefix: '/inventory' })

inventoryRouter.use(requireAuth)

/**
 * The inventory home page for scanning items.
 *
 * @name Inventory scan items page
 * @route {GET} /inventory/
 * @authentication This route requires authentication or will redirect to login page.
 */
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

/**
 * The order summary page.
 *
 * @name Order summary page
 * @route {POST} /inventory/order-summary
 * @authentication This route requires authentication or will redirect to login page.
 * @bodyparam {Item[]} items A list of items in the current order
 * @bodyparam {number} totalPrice The total price for all the items
 */
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

/**
 * The script to complete an order and subtract from the current stock.
 *
 * @name Complete order script
 * @route {POST} /inventory/complete-order
 * @authentication This route requires authentication or will redirect to login page.
 * @bodyparam {Item[]} items A list of items in the current order
 */
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

/**
 * The restock page.
 *
 * @name Restock page
 * @route {GET} /inventory/restock
 * @authentication This route requires authentication or will redirect to login page.
 */
inventoryRouter.get('/restock', async ctx => {
	try {
		await ctx.render('restock', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The new item page.
 *
 * @name New item page
 * @route {GET} /inventory/new-item
 * @authentication This route requires authentication or will redirect to login page.
 */
inventoryRouter.get('/new-item', async ctx => {
	try {
		await ctx.render('new-item', ctx.hbs)
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

/**
 * The all items page.
 *
 * @name All items page
 * @route {GET} /inventory/all-items
 * @authentication This route requires authentication or will redirect to login page.
 */
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

/**
 * The items to order page containing items that are below minimum stock,
 * together with the amount to order and the order cost.
 *
 * @name Items to order page
 * @route {GET} /inventory/items-to-order
 * @authentication This route requires authentication or will redirect to login page.
 */
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

/**
 * The specific item page.
 *
 * @name Item page
 * @route {GET} /inventory/items/:barcode
 * @authentication This route requires authentication or will redirect to login page.
 * @routeparam {String} :barcode is the barcode of the item
 */
inventoryRouter.get('/items/:barcode', async ctx => {
	try {
		const items = await new Items(dbName)
		const item = await items.findByBarcode(ctx.params.barcode)
		if (!item) {
			ctx.hbs.error = `There is no item with barcode ${ctx.params.barcode}`
			await ctx.render('error', ctx.hbs)
		} else {
			ctx.hbs.item = item
			await ctx.render('item', ctx.hbs)
		}
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

export { inventoryRouter }
