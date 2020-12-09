
import Router from 'koa-router'
import { Accounts } from '../modules/accounts.js'
import { dbName } from '../helpers/config.js'

const publicRouter = new Router()

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
publicRouter.get('/', async ctx => {
	try {
		if (ctx.hbs.authorised) {
			return ctx.redirect('/inventory?msg=you are logged in...')
		} else {
			await ctx.render('index', ctx.hbs)
		}
	} catch (err) {
		await ctx.render('error', ctx.hbs)
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
publicRouter.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
publicRouter.post('/register', async ctx => {
	const account = await new Accounts(dbName)
	try {
		// call the functions in the module
		await account.register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch (err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		account.close()
	}
})

/**
 * The user validation page.
 *
 * @name Validate page
 * @route {GET} /postregister
 */
publicRouter.get('/postregister', async ctx => await ctx.render('validate'))

/**
 * The script to process user validations.
 *
 * @name Validate script
 * @route {GET} /validate/:user/:token
 * @routeparam {String} :user is the user's ID
 * @routeparam {String} :token is the user's validation token
 */
publicRouter.get('/validate/:user/:token', async ctx => {
	try {
		console.log('VALIDATE')
		console.log(`URL --> ${ctx.request.url}`)
		if (!ctx.request.url.includes('.css')) {
			console.log(ctx.params)
			const milliseconds = 1000
			const now = Math.floor(Date.now() / milliseconds)
			const account = await new Accounts(dbName)
			await account.checkToken(ctx.params.user, ctx.params.token, now)
			ctx.hbs.msg = `account "${ctx.params.user}" has been validated`
			await ctx.render('login', ctx.hbs)
		}
	} catch (err) {
		await ctx.render('login', ctx.hbs)
	}
})

/**
 * The login page.
 *
 * @name Login page
 * @route {GET} /login
 */
publicRouter.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

/**
 * The script to log users in.
 *
 * @name Login script
 * @route {GET} /login
 */
publicRouter.post('/login', async ctx => {
	const account = await new Accounts(dbName)
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		await account.login(body.user, body.pass)
		ctx.session.authorised = true
		const referrer = body.referrer || '/inventory'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch (err) {
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		account.close()
	}
})

/**
 * The script to log users out.
 *
 * @name Logout script
 * @route {GET} /logout
 */
publicRouter.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

export { publicRouter }
