
import Router from 'koa-router'

import { publicRouter } from './public.js'
import { inventoryRouter } from './inventory.js'

const apiRouter = new Router()

const nestedRoutes = [publicRouter, inventoryRouter]
for (const router of nestedRoutes) apiRouter.use(router.routes(), router.allowedMethods())

export { apiRouter }
