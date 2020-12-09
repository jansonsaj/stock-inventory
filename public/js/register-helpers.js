/* register-helpers.js */
/* globals Handlebars */

/**
 * Script that registers client-side Handlebars helpers
 * @module public/js/register-helpers
 */

const PENCE_PER_POUND = 100
const POUND_DECIMAL_PLACES = 2

// Only register helpers when Handlebars is defined (Handlebars script is imported)
if (typeof Handlebars !== 'undefined') {
	Handlebars.registerHelper('asPounds', (pence) => (pence / PENCE_PER_POUND).toFixed(POUND_DECIMAL_PLACES))
}
