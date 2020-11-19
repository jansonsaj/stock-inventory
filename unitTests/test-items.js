
import test from 'ava'
import { Items } from '../modules/items.js'

function sampleItem() {
	return {
		id: 1,
		barcode: 'BARCODE',
		name: 'Name',
		description: 'Description',
		wholesale_price: 500,
		retail_price: 2000,
		max_stock: 100,
		min_stock: 10,
		stock: 20,
		photo: null
	}
}

test('INSERT : insert an item', async test => {
	test.plan(1)
	const items = await new Items() // no database specified so runs in-memory
	const inserted = await items.insert(sampleItem())
	test.is(inserted, true, 'unable to insert item')
	items.close()
})

test('INSERT : insert an item with duplicate barcode', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.insert(sampleItem())
		await items.insert(sampleItem())
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'barcode "BARCODE" already in use', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('INSERT : error if blank barcode', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.insert({ barcode: '' })
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'barcode can\'t be empty', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('FIND BY BARCODE : insert an item and find it by barcode', async test => {
	test.plan(1)
	const items = await new Items()
	await items.insert(sampleItem())
	const item = await items.findByBarcode('BARCODE')
	test.deepEqual(item, sampleItem(), 'unable to find item by barcode')
	items.close()
})

test('FIND BY BARCODE : barcode doesn\'t exist', async test => {
	test.plan(1)
	const items = await new Items()
	const item = await items.findByBarcode('BARCODE')
	test.is(item, undefined, 'item should have been undefined')
	items.close()
})

test('FIND BY BARCODE : empty barcode', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.findByBarcode(null)
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'barcode can\'t be empty', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('ALL : get all items', async test => {
	test.plan(2)
	const items = await new Items()
	await items.insert({ barcode: '1' })
	await items.insert({ barcode: '2' })
	await items.insert({ barcode: '3' })
	const allItems = await items.all()
	test.is(allItems.length, 3, 'didn\'t retrieve all items')
	test.is(allItems.map(item => item.barcode).join(' '), '1 2 3',
		'didn\'t get items with barcodes 1, 2 and 3')
	items.close()
})

test('ALL : get nothing when there are no items', async test => {
	test.plan(1)
	const items = await new Items()
	const allItems = await items.all()
	test.is(allItems.length, 0, 'retrieved items that shouldn\'t have been there')
	items.close()
})

test('ADD STOCK : increase item\'s stock from 20 to 25', async test => {
	test.plan(2)
	const items = await new Items()
	await items.insert(sampleItem())
	const added = await items.addStock('BARCODE', 5)
	const item = await items.findByBarcode('BARCODE')
	test.is(added, true, 'unable to add stock')
	test.is(item.stock, 25, 'item\'s stock should have been 25')
	items.close()
})

test('ADD STOCK : add stock to nonexisting barcode', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.addStock('BARCODE', 5)
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'item with the barcode "BARCODE" does not exist', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('SUBTRACT STOCK : decrease item\'s stock from 20 to 19', async test => {
	test.plan(2)
	const items = await new Items()
	await items.insert(sampleItem())
	const added = await items.subtractStock('BARCODE', 1)
	const item = await items.findByBarcode('BARCODE')
	test.is(added, true, 'unable to add stock')
	test.is(item.stock, 19, 'item\'s stock should have been 19')
	items.close()
})

test('SUBTRACT STOCK : subtract stock to nonexisting barcode', async test => {
	test.plan(1)
	const items = await new Items()
	try {
		await items.subtractStock('BARCODE', 5)
		test.fail('error not thrown')
	} catch (err) {
		test.is(err.message, 'item with the barcode "BARCODE" does not exist', 'incorrect error message')
	} finally {
		items.close()
	}
})

test('DEDUPLICATE AND COUNT : correctly counts items', async test => {
	test.plan(2)
	const item1 = sampleItem()
	item1.barcode = 'item1'
	const item2 = sampleItem()
	item2.barcode = 'item2'
	const items = Items.deduplicateAndCount([item1, item1, item2, item1, item2])
	items.forEach(item => {
		if (item.barcode === 'item1') {
			test.is(item.count, 3)
		} else if (item.barcode === 'item2') {
			test.is(item.count, 2)
		}
	})
})

test('DEDUPLICATE AND COUNT : correctly totals retail price', async test => {
	test.plan(2)
	const item1 = sampleItem()
	item1.barcode = 'item1'
	item1.retail_price = 15
	const item2 = sampleItem()
	item2.barcode = 'item2'
	item2.retail_price = 10
	const items = Items.deduplicateAndCount([item1, item1, item2, item1, item2])
	items.forEach(item => {
		if (item.barcode === 'item1') {
			test.is(item.total_retail_price, 45)
		} else if (item.barcode === 'item2') {
			test.is(item.total_retail_price, 20)
		}
	})
})

test('DEDUPLICATE AND COUNT : correctly totals wholesale price', async test => {
	test.plan(2)
	const item1 = sampleItem()
	item1.barcode = 'item1'
	item1.wholesale_price = 15
	const item2 = sampleItem()
	item2.barcode = 'item2'
	item2.wholesale_price = 10
	const items = Items.deduplicateAndCount([item1, item1, item2, item1, item2])
	items.forEach(item => {
		if (item.barcode === 'item1') {
			test.is(item.total_wholesale_price, 45)
		} else if (item.barcode === 'item2') {
			test.is(item.total_wholesale_price, 20)
		}
	})
})
