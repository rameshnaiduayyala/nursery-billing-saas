import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Styles for professional nursery invoice PDF
const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
    lineHeight: 1.4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: "#123D2B",
    paddingBottom: 16,
    marginBottom: 18,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#123D2B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 8,
    color: "#64748B",
    marginTop: 2,
  },
  docBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#123D2B",
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  docBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  docNumber: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 5,
    textAlign: "right",
  },
  docMeta: {
    fontSize: 8,
    color: "#64748B",
    marginTop: 2,
    textAlign: "right",
  },
  partyGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    backgroundColor: "#F5F7F1",
    padding: 12,
    borderRadius: 6,
  },
  partyCol: {
    width: "48%",
  },
  partyLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#123D2B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  partyDetail: {
    fontSize: 8.5,
    color: "#475569",
    marginBottom: 1.5,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E2EAE3",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#123D2B",
    paddingVertical: 7,
    paddingHorizontal: 8,
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2EAE3",
    fontSize: 8.5,
  },
  colNo: { width: "6%", textAlign: "center", color: "#64748B" },
  colItem: { width: "44%" },
  colVariety: { width: "16%" },
  colQty: { width: "10%", textAlign: "center" },
  colRate: { width: "12%", textAlign: "right" },
  colAmount: { width: "12%", textAlign: "right", fontWeight: "bold" },

  itemTitle: {
    fontWeight: "bold",
    color: "#1F2937",
  },
  itemSub: {
    fontSize: 7.5,
    color: "#64748B",
    marginTop: 1,
  },

  chargesSection: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FAFBF8",
    borderWidth: 1,
    borderColor: "#E2EAE3",
    borderRadius: 4,
  },
  chargesHeader: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#123D2B",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  chargeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#475569",
    marginBottom: 2,
  },

  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  totalsBox: {
    width: "48%",
    backgroundColor: "#F5F7F1",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2EAE3",
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 8.5,
    color: "#475569",
  },
  grandTotalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1.5,
    borderTopColor: "#123D2B",
    paddingTop: 5,
    marginTop: 5,
  },
  grandTotalText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#123D2B",
  },
  notesBox: {
    marginTop: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2EAE3",
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  notesContent: {
    fontSize: 8,
    color: "#475569",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: "#E2EAE3",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#94A3B8",
    fontSize: 7.5,
  },
});

export default function ProfessionalInvoicePDF({ invoice, nurseryInfo = {} }) {
  if (!invoice) return null;

  const isQuotation = invoice.documentType === "QUOTATION";
  const docTitle = isQuotation ? "ESTIMATE / QUOTATION" : "NON-GST INVOICE";

  return (
    <Document title={`${invoice.invoiceNumber || "Document"}.pdf`}>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.brandTitle}>
              {nurseryInfo.name || "NURSERYDESK"}
            </Text>
            {nurseryInfo.phone && (
              <Text style={styles.brandSubtitle}>Ph: {nurseryInfo.phone}</Text>
            )}
            {nurseryInfo.address && (
              <Text style={styles.brandSubtitle}>
                {typeof nurseryInfo.address === "object"
                  ? [
                      nurseryInfo.address.street,
                      nurseryInfo.address.city,
                      nurseryInfo.address.state,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : String(nurseryInfo.address)}
              </Text>
            )}
          </View>

          <View>
            <View style={styles.docBadge}>
              <Text style={styles.docBadgeText}>{docTitle}</Text>
            </View>
            <Text style={styles.docNumber}>{invoice.invoiceNumber}</Text>
            <Text style={styles.docMeta}>
              Date: {new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString("en-IN")}
            </Text>
            {invoice.dueDate && (
              <Text style={styles.docMeta}>
                {isQuotation ? "Valid Until: " : "Due Date: "}
                {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
              </Text>
            )}
          </View>
        </View>

        {/* Billed To / Issued By Party Details */}
        <View style={styles.partyGrid}>
          <View style={styles.partyCol}>
            <Text style={styles.partyLabel}>Customer Details (Billed To)</Text>
            <Text style={styles.partyName}>
              {invoice.customerSnapshot?.name || invoice.customerId?.name || "Valued Customer"}
            </Text>
            {invoice.customerSnapshot?.businessName && (
              <Text style={styles.partyDetail}>
                {invoice.customerSnapshot.businessName}
              </Text>
            )}
            <Text style={styles.partyDetail}>
              Ph: {invoice.customerSnapshot?.phone || invoice.customerId?.phone || "—"}
            </Text>
            {invoice.customerSnapshot?.address && (
              <Text style={styles.partyDetail}>
                {typeof invoice.customerSnapshot.address === "object"
                  ? [
                      invoice.customerSnapshot.address.street,
                      invoice.customerSnapshot.address.city,
                      invoice.customerSnapshot.address.state,
                      invoice.customerSnapshot.address.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : String(invoice.customerSnapshot.address)}
              </Text>
            )}
          </View>

          <View style={styles.partyCol}>
            <Text style={styles.partyLabel}>Issued Branch / Dispatch</Text>
            <Text style={styles.partyName}>
              {invoice.branchId?.name || "Main Nursery Branch"}
            </Text>
            {invoice.branchId?.code && (
              <Text style={styles.partyDetail}>Branch Code: {invoice.branchId.code}</Text>
            )}
            {invoice.branchId?.location && (
              <Text style={styles.partyDetail}>
                {typeof invoice.branchId.location === "object"
                  ? JSON.stringify(invoice.branchId.location)
                  : String(invoice.branchId.location)}
              </Text>
            )}
            {invoice.branchId?.address && (
              <Text style={styles.partyDetail}>
                {typeof invoice.branchId.address === "object"
                  ? [
                      invoice.branchId.address.street,
                      invoice.branchId.address.city,
                      invoice.branchId.address.state,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : String(invoice.branchId.address)}
              </Text>
            )}
          </View>
        </View>

        {/* Dynamic Plant Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNo}>#</Text>
            <Text style={styles.colItem}>Plant Item / Specifications</Text>
            <Text style={styles.colVariety}>Variety / Size</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate (₹)</Text>
            <Text style={styles.colAmount}>Amount (₹)</Text>
          </View>

          {invoice.items?.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.colNo}>{idx + 1}</Text>
              <View style={styles.colItem}>
                <Text style={styles.itemTitle}>{item.plantName || item.description}</Text>
                {item.description && item.description !== item.plantName && (
                  <Text style={styles.itemSub}>{item.description}</Text>
                )}
              </View>
              <View style={styles.colVariety}>
                <Text>{item.variety || "—"}</Text>
                {item.plantSize && <Text style={styles.itemSub}>{item.plantSize}</Text>}
              </View>
              <Text style={styles.colQty}>
                {item.quantity} {item.unitName || "PCS"}
              </Text>
              <Text style={styles.colRate}>
                {Number(item.unitPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.colAmount}>
                {Number(item.lineTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>

        {/* Additional Charges / Tariffs if present */}
        {invoice.charges && invoice.charges.length > 0 && (
          <View style={styles.chargesSection}>
            <Text style={styles.chargesHeader}>Additional Charges & Tariffs</Text>
            {invoice.charges.map((ch, idx) => (
              <View key={idx} style={styles.chargeRow}>
                <Text>
                  • {ch.name} {ch.description ? `(${ch.description})` : ""}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  +₹{Number(ch.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Summary Totals Box */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalLine}>
              <Text>Plant Line Total:</Text>
              <Text>₹{Number(invoice.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
            </View>

            {invoice.chargesTotal > 0 && (
              <View style={styles.totalLine}>
                <Text>Additional Charges:</Text>
                <Text style={{ color: "#123D2B" }}>
                  +₹{Number(invoice.chargesTotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </Text>
              </View>
            )}

            {invoice.discountAmount > 0 && (
              <View style={styles.totalLine}>
                <Text>Discount Applied:</Text>
                <Text style={{ color: "#DC2626" }}>
                  -₹{Number(invoice.discountAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </Text>
              </View>
            )}

            <View style={styles.grandTotalLine}>
              <Text style={styles.grandTotalText}>Grand Total:</Text>
              <Text style={styles.grandTotalText}>
                ₹{Number(invoice.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms & Delivery Notes */}
        {invoice.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesTitle}>Delivery Instructions & Terms</Text>
            <Text style={styles.notesContent}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated via NurseryDesk SaaS Platform</Text>
          <Text>
            {isQuotation
              ? "This is an estimate quotation and not an official tax invoice."
              : "This is a computer generated non-GST bill."}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

