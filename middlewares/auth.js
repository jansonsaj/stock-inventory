/**
 * Middleware for managing authentication
 * @module middlewares/auth
 */

/**
 * Require the user to be authorised or redirect them to login
 * @param {object} ctx Koa Context
 * @param {function} next Koa Next
 */
const requireAuth = async(ctx, next) => {
	if (ctx.hbs.authorised !== true) {
		return ctx.redirect(`/login?msg=you need to log in&referrer=${ctx.request.url}`)
	} else {
		await next()
	}
}

export { requireAuth }
