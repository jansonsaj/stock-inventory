
import test from 'ava'
import sinon from 'sinon'
import { EmailSender } from '../modules/email-sender.js'

function sampleItem() {
	return {
		name: 'Arduino',
		barcode: 'barcode',
		wholesale_price: 10,
		stock: 5,
		min_stock: 10,
		max_stock: 20
	}
}

test.before(() => {
	EmailSender.SENDER_ADDRESS = 'sender@email.com'
	EmailSender.SHOP_OWNER_ADDRESS = 'owner@email.com'
})

test('SEND MAIL : has correct sender', async test => {
	test.plan(1)
	const emailSender = await new EmailSender()
	emailSender.transporter = {
		sendMail: (options) => {
			test.is(options.from, 'sender@email.com')
		}
	}

	emailSender.sendMail('to', 'subject', 'html')
})

test('SEND MAIL : has correct recipient', async test => {
	test.plan(1)
	const emailSender = await new EmailSender()
	emailSender.transporter = {
		sendMail: (options) => {
			test.is(options.to, 'to')
		}
	}

	emailSender.sendMail('to', 'subject', 'html')
})

test('SEND MAIL : has correct subject', async test => {
	test.plan(1)
	const emailSender = await new EmailSender()
	emailSender.transporter = {
		sendMail: (options) => {
			test.is(options.subject, 'subject')
		}
	}

	emailSender.sendMail('to', 'subject', 'html')
})

test('SEND MAIL : has correct html', async test => {
	test.plan(1)
	const emailSender = await new EmailSender()
	emailSender.transporter = {
		sendMail: (options) => {
			test.is(options.html, 'html')
		}
	}

	emailSender.sendMail('to', 'subject', 'html')
})

test('SEND ORDER NOTIFICATION : has correct recipient', async test => {
	test.plan(1)
	const emailSender = await new EmailSender()
	sinon.stub(emailSender, 'sendMail')
		.callsFake((to) => {

			console.log(to)
			test.is(to, 'owner@email.com')
		})

	emailSender.sendOrderNotification(sampleItem())
})

test('SEND ORDER NOTIFICATION : has correct subject', async test => {
	test.plan(1)
	const emailSender = await new EmailSender()
	sinon.stub(emailSender, 'sendMail')
		.callsFake((to, subject) => {
			test.is(subject, 'Notification to order item: Arduino')
		})

	emailSender.sendOrderNotification(sampleItem())
})

test('SEND ORDER NOTIFICATION : has correct html message', async test => {
	test.plan(8)
	const emailSender = await new EmailSender()
	sinon.stub(emailSender, 'sendMail')
		.callsFake((to, subject, html) => {
			test.regex(html, /Item: Arduino/)
			test.regex(html, /Barcode: barcode/)
			test.regex(html, /Current stock: 5/)
			test.regex(html, /Minimum stock level: 10/)
			test.regex(html, /Maximum stock level: 20/)
			test.regex(html, /Item\'s wholesale price: £0.10/)
			test.regex(html, /Items to order: 15/)
			test.regex(html, /Total order wholesale price: £1.50/)
		})

	emailSender.sendOrderNotification(sampleItem())
})
