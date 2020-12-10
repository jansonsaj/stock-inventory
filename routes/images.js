/**
 * Image router
 * @module routes/images
 */
import Router from 'koa-router'
import {v1 as uuidv1} from 'uuid'
import mime from 'mime-types'
import fs from 'fs/promises'
import { requireAuth } from '../middlewares/auth.js'

const externalImageDirectory = 'images'
const localImageDirectory = 'public/images'

const imageRouter = new Router({prefix: '/images'})

/**
 * The upload image script.
 *
 * @name Upload image script
 * @route {POST} /images
 * @authentication This route requires authentication or will redirect to login page.
 * @bodyparam {object} image The image to upload
 */
imageRouter.post('/', requireAuth, async ctx => {
	try {
		const {path, type} = ctx.request.files.image
		const extension = mime.extension(type)
		const imageName = `${uuidv1()}.${extension}`

		await fs.copyFile(path, `${localImageDirectory}/${imageName}`)

		ctx.body = {
			imageLocation: `${ctx.protocol}://${ctx.host}/${externalImageDirectory}/${imageName}`
		}
	} catch (err) {
		ctx.status = 400
		ctx.body = err.message
	}
})

export { imageRouter }
