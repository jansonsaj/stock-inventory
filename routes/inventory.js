
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

inventoryRouter.get('/item/:barcode', async ctx => {
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

export { inventoryRouter }
