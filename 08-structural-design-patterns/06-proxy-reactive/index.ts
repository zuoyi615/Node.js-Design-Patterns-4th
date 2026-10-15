import { createObservable } from './create-observable.ts'

function calculateTotal({ subtotal, discount, tax }: Invoice) {
  return subtotal - discount - tax
}

const invoice = {
  subtotal: 100,
  discount: 10,
  tax: 20,
}
type Invoice = typeof invoice

let total = calculateTotal(invoice)
console.log(`Starting total: ${total}`)

const obsInvoice: Invoice = createObservable(invoice, ({ prop, prev, curr }) => {
  total = calculateTotal(invoice)
  console.log(`TOTAL: ${total} (\`${prop}\` changed: ${prev} -> ${curr})`)
})

obsInvoice.subtotal = 200
obsInvoice.discount = 20
obsInvoice.discount = 20
obsInvoice.tax = 30

console.log(`Final total: ${total}`)
