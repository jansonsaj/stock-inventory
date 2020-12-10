/**
 * Router combining all of the routes
 * @module routes/routes
 */
import Router from 'koa-router'
import bodyParser from 'koa-body'

import { publicRouter } from './public.js'
import { inventoryRouter } from './inventory.js'
import { inventoryApiRouter } from './inventory-api.js'
import { imageRouter } from './images.js'

const apiRouter = new Router()
apiRouter.use(bodyParser({multipart: true}))

const nestedRoutes = [publicRouter, inventoryRouter, inventoryApiRouter, imageRouter]
for (const router of nestedRoutes) apiRouter.use(router.routes(), router.allowedMethods())

export { apiRouter }
