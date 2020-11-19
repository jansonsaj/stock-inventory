/* register-helpers.js */
/* globals Handlebars */

const PENCE_PER_POUND = 100
const POUND_DECIMAL_PLACES = 2

Handlebars.registerHelper('asPounds', (pence) => (pence / PENCE_PER_POUND).toFixed(POUND_DECIMAL_PLACES))
