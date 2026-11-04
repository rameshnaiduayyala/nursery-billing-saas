import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const C = {
  forest: "#123D2B",
  green: "#176B45",
  emerald: "#278457",
  ink: "#17251E",
  body: "#42534A",
  muted: "#718078",
  line: "#DCE7DF",
  soft: "#F4F8F3",
  softGreen: "#EAF3EA",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 58,
    paddingHorizontal: 38,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.ink,
    backgroundColor: C.white,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    marginBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: C.forest,
  },
  brandBlock: { width: "57%" },
  brandTitle: {
    fontFamily: "Times-Bold",
    fontSize: 24,
    color: C.forest,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  tagline: {
    fontFamily: "Times-Italic",
    marginTop: 4,
    fontSize: 8.5,
    color: C.green,
    letterSpacing: 0.5,
  },
  businessMeta: {
    marginTop: 8,
    fontSize: 8,
    color: C.body,
    lineHeight: 1.55,
  },
  documentBlock: { width: "39%", alignItems: "flex-end" },
  docBadge: {
    backgroundColor: C.forest,
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 4,
  },
  docBadgeText: {
    color: C.white,
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 0.65,
  },
  docNumber: {
    marginTop: 9,
    fontSize: 14,
    fontWeight: "bold",
    color: C.forest,
    textAlign: "right",
  },
  docMeta: {
    marginTop: 3,
    fontSize: 8,
    color: C.muted,
    textAlign: "right",
  },
  sectionHeading: {
    fontSize: 8,
    fontWeight: "bold",
    color: C.green,
    letterSpacing: 0.7,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  partyGrid: {
    flexDirection: "row",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 7,
    backgroundColor: C.soft,
    padding: 13,
  },
  partyCol: { width: "50%", paddingRight: 12 },
  partyColRight: {
    width: "50%",
    paddingLeft: 14,
    borderLeftWidth: 1,
    borderLeftColor: C.line,
  },
  partyName: {
    fontSize: 10,
    fontWeight: "bold",
    color: C.ink,
    marginBottom: 4,
  },
  partyDetail: {
    fontSize: 8,
    color: C.body,
    marginTop: 2,
    lineHeight: 1.45,
  },
  tableSectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: C.forest,
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.forest,
    paddingVertical: 9,
    paddingHorizontal: 8,
  },
  headerText: {
    color: C.white,
    fontSize: 7.2,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 37,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 0.7,
    borderBottomColor: C.line,
  },
  tableRowAlt: { backgroundColor: "#FAFCFA" },
  colNo: { width: "5%", textAlign: "center", color: C.muted },
  colItem: { width: "34%", paddingRight: 5 },
  colVariety: { width: "19%", paddingRight: 4 },
  colQty: { width: "12%", textAlign: "center" },
  colRate: { width: "14%", textAlign: "right" },
  colAmount: { width: "16%", textAlign: "right", fontWeight: "bold", color: C.forest },
  itemTitle: { fontSize: 8.5, fontWeight: "bold", color: C.ink },
  itemSub: { fontSize: 7.2, color: C.muted, marginTop: 2 },
  cellText: { fontSize: 8, color: C.body },
  chargesSection: {
    marginTop: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 6,
    backgroundColor: "#FBFCFA",
  },
  chargesHeader: {
    fontSize: 8,
    fontWeight: "bold",
    color: C.forest,
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  chargeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0.6,
    borderBottomColor: C.line,
  },
  chargeName: { fontSize: 8, color: C.body, width: "75%" },
  chargeAmount: { fontSize: 8, color: C.forest, fontWeight: "bold" },
  bottomGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 16,
  },
  notesBox: {
    width: "48%",
    padding: 11,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 6,
    backgroundColor: C.white,
  },
  notesTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: C.green,
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  notesContent: { fontSize: 8, color: C.body, lineHeight: 1.55 },
  totalsBox: {
    width: "46%",
    padding: 12,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 7,
    backgroundColor: C.soft,
  },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
    fontSize: 8.5,
    color: C.body,
  },
  totalValue: { fontSize: 8.5, color: C.ink, fontWeight: "bold" },
  grandTotalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    paddingTop: 9,
    borderTopWidth: 1.3,
    borderTopColor: C.green,
  },
  grandTotalLabel: { fontSize: 10, fontWeight: "bold", color: C.forest },
  grandTotalValue: { fontSize: 13, fontWeight: "bold", color: C.forest },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 28,
  },
  signatureBlock: {
    width: 155,
    borderTopWidth: 0.8,
    borderTopColor: C.muted,
    paddingTop: 5,
    alignItems: "center",
  },
  signatureText: { fontSize: 7.5, color: C.muted },
  watermarkWrapper: {
    position: "absolute",
    top: 250,
    left: 40,
    right: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    transform: "rotate(-32deg)",
  },
  watermarkText: {
    fontSize: 66,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#DC2626",
    opacity: 0.16,
    letterSpacing: 8,
    textTransform: "uppercase",
    borderWidth: 5,
    borderColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 8,
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 38,
    right: 38,
    borderTopWidth: 1,
    borderTopColor: C.line,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 7, color: C.muted },
});

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const date = (value) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default function ProfessionalInvoicePDF({
  invoice,
  nurseryInfo: passedNurseryInfo,
}) {
  if (!invoice) return null;

  // Browser storage is optional. Keep this component safe for server rendering.
  const storedOrg = (() => {
    try {
      if (typeof window === "undefined") return {};
      return JSON.parse(
        window.localStorage.getItem("nursery_current_org_data") || "{}"
      );
    } catch {
      return {};
    }
  })();

  const nursery = {
    name:
      invoice.organizationId?.name ||
      passedNurseryInfo?.name ||
      storedOrg?.name ||
      "NurseryDesk",
    phone:
      invoice.organizationId?.phone ||
      passedNurseryInfo?.phone ||
      storedOrg?.phone ||
      "",
    email:
      invoice.organizationId?.email ||
      passedNurseryInfo?.email ||
      storedOrg?.email ||
      "",
    address:
      invoice.organizationId?.address ||
      passedNurseryInfo?.address ||
      storedOrg?.address ||
      null,
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;
    if (typeof addr === "object") {
      return [addr.street, addr.city, addr.state, addr.pincode]
        .filter(Boolean)
        .join(", ");
    }
    return String(addr);
  };

  const isQuotation = invoice.documentType === "QUOTATION";
  const isCancelled = invoice.status === "CANCELLED";
  const docTitle = isCancelled
    ? "CANCELLED"
    : isQuotation
    ? "QUOTATION"
    : "NON-GST INVOICE";
  const customerName =
    invoice.customerSnapshot?.name ||
    invoice.customerId?.name ||
    "Valued Customer";
  const customerPhone =
    invoice.customerSnapshot?.phone || invoice.customerId?.phone;
  const customerAddress = formatAddress(invoice.customerSnapshot?.address);
  const nurseryAddress = formatAddress(nursery.address);

  return (
    <Document title={`${invoice.invoiceNumber || "NurseryDesk-Invoice"}.pdf`}>
      <Page size="A4" style={styles.page} wrap>
        {/* Cancelled Watermark Overlay */}
        {isCancelled && (
          <View style={styles.watermarkWrapper} fixed>
            <Text style={styles.watermarkText}>CANCELLED</Text>
          </View>
        )}

        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <Text style={styles.brandTitle}>{nursery.name}</Text>
          </View>

          <View style={styles.documentBlock}>
            <View style={styles.docBadge}>
              <Text style={styles.docBadgeText}>{docTitle}</Text>
            </View>
            <Text style={styles.docNumber}>{invoice.invoiceNumber || "—"}</Text>
            <Text style={styles.docMeta}>
              {isQuotation ? "Quotation Date" : "Invoice Date"}: {date(invoice.invoiceDate || invoice.createdAt)}
            </Text>
            {invoice.dueDate ? (
              <Text style={styles.docMeta}>
                {isQuotation ? "Valid Until" : "Payment Due"}: {date(invoice.dueDate)}
              </Text>
            ) : null}
            {invoice.branchName ? (
              <Text style={styles.docMeta}>Branch: {invoice.branchName}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.partyGrid}>
          <View style={styles.partyCol}>
            <Text style={styles.sectionHeading}>Billed To</Text>
            <Text style={styles.partyName}>{customerName}</Text>
            {invoice.customerSnapshot?.businessName ? (
              <Text style={styles.partyDetail}>{invoice.customerSnapshot.businessName}</Text>
            ) : null}
            {customerPhone ? (
              <Text style={styles.partyDetail}>Phone: {customerPhone}</Text>
            ) : null}
            {customerAddress ? (
              <Text style={styles.partyDetail}>{customerAddress}</Text>
            ) : null}
          </View>
          <View style={styles.partyColRight}>
            <Text style={styles.sectionHeading}>Issued By</Text>
            <Text style={[styles.partyName, { fontFamily: "Times-Bold", fontSize: 11, color: C.forest }]}>
              {nursery.name}
            </Text>
            {nursery.phone ? <Text style={styles.partyDetail}>Phone: {nursery.phone}</Text> : null}
            {nursery.email ? <Text style={styles.partyDetail}>Email: {nursery.email}</Text> : null}
            {nurseryAddress ? <Text style={styles.partyDetail}>{nurseryAddress}</Text> : null}
            {invoice.branchName ? <Text style={styles.partyDetail}>Branch: {invoice.branchName}</Text> : null}
          </View>
        </View>

        <Text style={styles.tableSectionTitle}>Plant Items & Specifications</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colNo, styles.headerText]}>#</Text>
            <Text style={[styles.colItem, styles.headerText]}>PLANT / DESCRIPTION</Text>
            <Text style={[styles.colVariety, styles.headerText]}>VARIETY / SIZE</Text>
            <Text style={[styles.colQty, styles.headerText]}>QTY</Text>
            <Text style={[styles.colRate, styles.headerText]}>RATE (₹)</Text>
            <Text style={[styles.colAmount, styles.headerText]}>AMOUNT (₹)</Text>
          </View>

          {invoice.items?.map((item, idx) => (
            <View
              key={item.id || `${item.plantName || "item"}-${idx}`}
              style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
              wrap={false}
            >
              <Text style={styles.colNo}>{idx + 1}</Text>
              <View style={styles.colItem}>
                <Text style={styles.itemTitle}>{item.plantName || item.description || "Plant item"}</Text>
                {item.description && item.description !== item.plantName ? (
                  <Text style={styles.itemSub}>{item.description}</Text>
                ) : null}
              </View>
              <View style={styles.colVariety}>
                <Text style={styles.cellText}>{item.variety || "—"}</Text>
                {item.plantSize ? <Text style={styles.itemSub}>{item.plantSize}</Text> : null}
              </View>
              <Text style={[styles.colQty, styles.cellText]}>
                {item.quantity} {item.unitName || "PCS"}
              </Text>
              <Text style={[styles.colRate, styles.cellText]}>{money(item.unitPrice)}</Text>
              <Text style={styles.colAmount}>{money(item.lineTotal)}</Text>
            </View>
          ))}
        </View>

        {invoice.charges?.length > 0 ? (
          <View style={styles.chargesSection}>
            <Text style={styles.chargesHeader}>Additional Charges & Freight</Text>
            {invoice.charges.map((charge, idx) => (
              <View
                key={charge.id || `${charge.name || "charge"}-${idx}`}
                style={styles.chargeRow}
                wrap={false}
              >
                <Text style={styles.chargeName}>
                  {charge.name || "Additional charge"}
                  {charge.description ? ` · ${charge.description}` : ""}
                </Text>
                <Text style={styles.chargeAmount}>{money(charge.amount)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.bottomGrid}>
          {invoice.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesTitle}>Notes & Delivery Instructions</Text>
              <Text style={styles.notesContent}>{invoice.notes}</Text>
            </View>
          ) : (
            <View style={{ width: "48%" }} />
          )}

          <View style={styles.totalsBox}>
            <View style={styles.totalLine}>
              <Text>Plant Subtotal</Text>
              <Text style={styles.totalValue}>{money(invoice.subtotal)}</Text>
            </View>
            {Number(invoice.chargesTotal) > 0 ? (
              <View style={styles.totalLine}>
                <Text>Additional Charges</Text>
                <Text style={styles.totalValue}>{money(invoice.chargesTotal)}</Text>
              </View>
            ) : null}
            {Number(invoice.discountAmount) > 0 ? (
              <View style={styles.totalLine}>
                <Text>Discount</Text>
                <Text style={[styles.totalValue, { color: "#B54747" }]}>
                  -{money(invoice.discountAmount)}
                </Text>
              </View>
            ) : null}
            <View style={styles.grandTotalLine}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>{money(invoice.grandTotal)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.signatureRow}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureText}>Authorized Signature</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Thank you for your business.</Text>
          <Text style={styles.footerText}>
            {isQuotation
              ? "Quotation only · Subject to confirmation"
              : "Computer-generated non-GST bill · No signature required if digitally issued"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
