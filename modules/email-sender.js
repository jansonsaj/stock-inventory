/**
 * Module for sending emails
 * @module modules/email-sender
 */
import nodemailer from 'nodemailer'
import { Items } from './items.js'

/**
 * Gets credentials for the email to send with
 * @return {obejct} Email credentials
 */
function getEmailCredentials() {
	// Normally credentials should be extracted from secrets.
	// Returning them in plain-text only for prototyping purposes.
	return {
		user: 'jansonsa.sem1@gmail.com',
		pass: 'bL6mH1gJ8tL5tT2n'
	}
}

class EmailSender {
	static SENDER_ADDRESS = 'jansonsa.sem1@gmail.com'
	static SHOP_OWNER_ADDRESS = 'jansonsa@uni.coventry.ac.uk'

	constructor() {
		return (async() => {
			this.transporter = await nodemailer.createTransport({
				service: 'gmail',
				auth: getEmailCredentials()
			})
			return this
		})()
	}

	/**
	 * Send an email from the predefined sender
	 * @param {string} to Email address of the receiver
	 * @param {string} subject Subject line
	 * @param {string} html Html to use as email body
	 */
	async sendMail(to, subject, html) {
		await this.transporter.sendMail({
			from: EmailSender.SENDER_ADDRESS,
			to,
			subject,
			html
		  })
	}

	/**
	 * Send an email to notify the shop owner that an item has
	 * dropped below minimum stock levels and needs to be ordererd.
	 * @param {object} item Item that needs to be ordered
	 */
	async sendOrderNotification(item) {
		const subject = `Notification to order item: ${item.name}`
		const itemsToOrder = item.max_stock - item.stock
		const totalOrderPrice = itemsToOrder * item.wholesale_price
		const html = `<h1>${subject}</h1>
		<p>Shop owner,</p>
		<p>This is an automated message from the Stock Control and Monitoring system
		to inform you that an item's stock has fallen below minimum stock levels.
		More stock should be ordered.</p>
		<p>Item: ${item.name}</p>
		<p>Barcode: ${item.barcode}</p>
		<p>Current stock: ${item.stock}</p>
		<p>Minimum stock level: ${item.min_stock}</p>
		<p>Maximum stock level: ${item.max_stock}</p>
		<p>Item's wholesale price: £${Items.penceToPounds(item.wholesale_price)}</p>
		<p>Items to order: ${itemsToOrder}</p>
		<p>Total order wholesale price: £${Items.penceToPounds(totalOrderPrice)}</p>`
		await this.sendMail(EmailSender.SHOP_OWNER_ADDRESS, subject, html)
	}
}

export { EmailSender }
