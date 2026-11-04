import { CustomerLedgerEntry } from "../models/Ledger.js";
import { Customer } from "../models/Customer.js";

/**
 * Appends an entry to the customer's chronological financial ledger and updates their outstanding balance
 */
export async function recordLedgerEntry({
  organizationId,
  branchId = null,
  customerId,
  entryType,
  transactionDate = new Date(),
  referenceType = "MANUAL",
  referenceId = null,
  referenceNumber = null,
  description,
  debitAmount = 0,
  creditAmount = 0,
}) {
  const customer = await Customer.findOne({ _id: customerId, organizationId });
  if (!customer) {
    throw new Error("Customer not found for ledger update");
  }

  // Find the latest ledger entry to get latest running balance
  const lastEntry = await CustomerLedgerEntry.findOne({ organizationId, customerId })
    .sort({ transactionDate: -1, createdAt: -1 });

  const currentBalance = lastEntry ? lastEntry.runningBalance : (customer.openingBalance || 0);

  // In business accounting:
  // Debit increases customer owing (e.g. Invoiced sale)
  // Credit decreases customer owing (e.g. Payment receipt, discount credit)
  const newRunningBalance = currentBalance + Number(debitAmount || 0) - Number(creditAmount || 0);

  const entry = await CustomerLedgerEntry.create({
    organizationId,
    branchId,
    customerId,
    entryType,
    transactionDate,
    referenceType,
    referenceId,
    referenceNumber,
    description,
    debitAmount: Number(debitAmount || 0),
    creditAmount: Number(creditAmount || 0),
    runningBalance: newRunningBalance,
  });

  return entry;
}

