# Financial services

Implement decimal-safe calculations and transaction services here.

Required services:
- calculateDocumentTotals(items, discounts, charges)
- issueInvoiceWithSequence()
- convertQuotationToInvoice()
- recordPaymentAndAllocate()
- postCustomerLedgerEntry()
- cancelInvoiceWithAuditTrail()

Use Prisma Decimal or a decimal arithmetic library. Never use binary floating-point arithmetic for money.
