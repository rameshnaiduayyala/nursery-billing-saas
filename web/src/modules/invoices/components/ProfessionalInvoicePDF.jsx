import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Premium Luxury Horticulture Color Palette
const C = {
  // Deep Regal Forest & Emerald Tones
  primary: "#0B2E1E", // Deep Regal Forest Green
  primaryDark: "#061A11", // Midnight Emerald
  primaryMedium: "#13422C", // Rich British Forest
  primarySoft: "#1B593B", // Soft Botanical Emerald

  // Champagne Gold & Warm Luxury Accents
  gold: "#C5A059", // Warm Antique Champagne Gold
  goldDark: "#9A7836", // Deep Gold for Text
  goldLight: "#FBF7EE", // Subtle Champagne Ivory Tint
  goldBorder: "#DECBB0", // Refined Gold Hairline

  // High-End Typography Neutrals
  ink: "#0F172A", // Slate 900 for Crisp Contrast
  inkSecondary: "#334155", // Slate 700 for Body Content
  muted: "#64748B", // Slate 500 for Clean Labels
  mutedLight: "#94A3B8", // Slate 400 for Minor Captions

  // Paper & Surface Tones
  paper: "#FFFFFF",
  paperWarm: "#FAFBF9", // Fine Linen / Warm Ivory
  paperTint: "#F4F7F4", // Soft Botanical Sage Tint
  borderLight: "#E2E8E0", // Subtle Card Border
  borderDotted: "#CBD5E1", // Clean Divider

  // Status Accents
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  dangerBorder: "#FCA5A5",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 48,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: C.ink,
    backgroundColor: C.paper,
    lineHeight: 1.4,
  },

  // Top Luxury Accent Bar
  topAccentBar: {
    height: 4,
    backgroundColor: C.primary,
    marginBottom: 20,
    borderRadius: 2,
  },
  topGoldStripe: {
    height: 1.5,
    backgroundColor: C.gold,
    marginTop: -1.5,
    borderRadius: 1,
  },

  // Header Section
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  brandBlock: {
    width: "60%",
    paddingRight: 10,
  },
  brandTitle: {
    fontFamily: "Times-Bold",
    fontSize: 18,
    lineHeight: 1.25,
    color: C.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  brandTagline: {
    fontFamily: "Times-Italic",
    fontSize: 8.5,
    color: C.goldDark,
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  brandMetaRow: {
    fontSize: 7.8,
    color: C.inkSecondary,
    lineHeight: 1.4,
  },

  // Document Info Block (Right Aligned)
  docBlock: {
    width: "38%",
    alignItems: "flex-end",
  },
  docBadge: {
    backgroundColor: C.primary,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.gold,
    marginBottom: 6,
  },
  docBadgeText: {
    color: C.goldLight,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  docNumberText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: C.primary,
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: "right",
  },
  metaGrid: {
    marginTop: 2,
    alignItems: "flex-end",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 2.5,
  },
  metaLabel: {
    fontSize: 7.8,
    color: C.muted,
    marginRight: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  metaValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
  },

  // Party Grid (Billed To & Issued By Cards)
  partyGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  partyCard: {
    width: "48.5%",
    backgroundColor: C.paperWarm,
    borderWidth: 1,
    borderColor: C.borderLight,
    borderRadius: 6,
    padding: 11,
  },
  partyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  goldDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.gold,
    marginRight: 5,
  },
  partyLabel: {
    fontSize: 7.2,
    fontFamily: "Helvetica-Bold",
    color: C.primaryMedium,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  partyName: {
    fontFamily: "Times-Bold",
    fontSize: 10.5,
    lineHeight: 1.25,
    color: C.ink,
    marginBottom: 3,
  },
  partyBusinessName: {
    fontSize: 8.2,
    fontFamily: "Helvetica-Bold",
    color: C.primaryMedium,
    marginBottom: 3,
  },
  partyText: {
    fontSize: 7.8,
    color: C.inkSecondary,
    marginBottom: 2,
    lineHeight: 1.4,
  },

  // Table Section
  tableHeadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  tableHeadingText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  tableFrame: {
    borderWidth: 1,
    borderColor: C.borderLight,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  thText: {
    color: C.paper,
    fontFamily: "Helvetica-Bold",
    fontSize: 7.2,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 34,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.6,
    borderBottomColor: C.borderLight,
  },
  tableRowAlt: {
    backgroundColor: C.paperWarm,
  },

  // Table Columns
  colNo: { width: "5%", textAlign: "center", color: C.muted },
  colItem: { width: "35%", paddingRight: 6 },
  colVariety: { width: "19%", paddingRight: 4 },
  colQty: { width: "11%", textAlign: "center" },
  colRate: { width: "14%", textAlign: "right" },
  colAmount: {
    width: "16%",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    color: C.primary,
  },

  itemTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.2,
    color: C.ink,
  },
  itemSub: {
    fontSize: 7.2,
    color: C.muted,
    marginTop: 1.5,
  },
  cellText: {
    fontSize: 8,
    color: C.inkSecondary,
  },

  // Additional Charges Section
  chargesBox: {
    marginTop: 14,
    padding: 10,
    backgroundColor: C.paperWarm,
    borderWidth: 1,
    borderColor: C.borderLight,
    borderRadius: 6,
  },
  chargesHeader: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  chargeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderLight,
  },
  chargeName: {
    fontSize: 7.8,
    color: C.inkSecondary,
    width: "75%",
  },
  chargeAmount: {
    fontSize: 7.8,
    fontFamily: "Helvetica-Bold",
    color: C.primaryMedium,
  },

  // Bottom Grid (Notes & Summary Totals)
  bottomGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 14,
  },
  notesCard: {
    width: "48.5%",
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.borderLight,
    borderRadius: 6,
    padding: 10,
  },
  notesHeading: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  notesBody: {
    fontSize: 7.8,
    color: C.inkSecondary,
    lineHeight: 1.5,
  },
  paymentNotice: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 0.6,
    borderTopColor: C.borderLight,
    fontSize: 7.2,
    color: C.muted,
    fontFamily: "Times-Italic",
  },

  // Totals Box
  totalsCard: {
    width: "47%",
    backgroundColor: C.paperWarm,
    borderWidth: 1,
    borderColor: C.borderLight,
    borderRadius: 6,
    padding: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5.5,
  },
  totalLabel: {
    fontSize: 8,
    color: C.muted,
  },
  totalVal: {
    fontSize: 8.2,
    fontFamily: "Helvetica-Bold",
    color: C.ink,
  },
  discountVal: {
    fontSize: 8.2,
    fontFamily: "Helvetica-Bold",
    color: "#B91C1C",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: C.gold,
    backgroundColor: C.primary,
    marginHorizontal: -10,
    marginBottom: -10,
    paddingHorizontal: 10,
    paddingBottom: 8,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  grandTotalLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.goldLight,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  grandTotalVal: {
    fontSize: 12.5,
    fontFamily: "Helvetica-Bold",
    color: C.paper,
  },

  // Signature Block
  signatureGrid: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 22,
  },
  signatureBox: {
    width: 170,
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderTopWidth: 0.8,
    borderTopColor: C.muted,
    marginBottom: 4,
  },
  signatureSignatoryText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.inkSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  signatureFirmText: {
    fontSize: 6.8,
    color: C.muted,
    marginTop: 1,
  },

  // Cancelled Watermark
  watermarkContainer: {
    position: "absolute",
    top: 250,
    left: 40,
    right: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    transform: "rotate(-30deg)",
  },
  watermarkBox: {
    borderWidth: 4,
    borderColor: "#DC2626",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: "rgba(254, 242, 242, 0.4)",
  },
  watermarkText: {
    fontSize: 54,
    fontFamily: "Helvetica-Bold",
    color: "#DC2626",
    opacity: 0.18,
    letterSpacing: 8,
    textTransform: "uppercase",
  },

  // Footer Section
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    borderTopWidth: 0.7,
    borderTopColor: C.borderLight,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 6.8,
    color: C.mutedLight,
  },
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

  // Retrieve nursery details with fallback priority
  const storedOrg = (() => {
    try {
      if (typeof window === "undefined") return {};
      return JSON.parse(
        window.localStorage.getItem("nursery_current_org_data") || "{}",
      );
    } catch {
      return {};
    }
  })();

  const nursery = {
    name:
      invoice.organizationSnapshot?.name ||
      invoice.organizationId?.name ||
      passedNurseryInfo?.name ||
      storedOrg?.name ||
      "NurseryDesk Farms & Agro",
    phone:
      invoice.organizationSnapshot?.phone ||
      invoice.organizationId?.phone ||
      passedNurseryInfo?.phone ||
      storedOrg?.phone ||
      "",
    email:
      invoice.organizationSnapshot?.email ||
      invoice.organizationId?.email ||
      passedNurseryInfo?.email ||
      storedOrg?.email ||
      "",
    address:
      invoice.organizationSnapshot?.address ||
      invoice.organizationId?.address ||
      passedNurseryInfo?.address ||
      storedOrg?.address ||
      null,
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;
    if (typeof addr === "object") {
      return [
        addr.street || addr.line1,
        addr.city,
        addr.state,
        addr.pincode || addr.postalCode,
      ]
        .filter(Boolean)
        .join(", ");
    }
    return String(addr);
  };

  const isQuotation = invoice.documentType === "QUOTATION";
  const isCancelled = invoice.status === "CANCELLED";
  const docBadgeTitle = isCancelled
    ? "CANCELLED"
    : isQuotation
      ? "QUOTATION ESTIMATE"
      : "TAX BILL / INVOICE";

  const customerName =
    invoice.customerSnapshot?.name ||
    invoice.customerId?.name ||
    "Valued Customer";
  const customerPhone =
    invoice.customerSnapshot?.phone || invoice.customerId?.phone;
  const customerAddress = formatAddress(invoice.customerSnapshot?.address);
  const nurseryAddress = formatAddress(nursery.address);

  return (
    <Document title={`${invoice.invoiceNumber || "NurseryDesk-Bill"}.pdf`}>
      <Page size="A4" style={styles.page} wrap>
        {/* Cancelled Watermark Overlay */}
        {isCancelled && (
          <View style={styles.watermarkContainer} fixed>
            <View style={styles.watermarkBox}>
              <Text style={styles.watermarkText}>CANCELLED</Text>
            </View>
          </View>
        )}

        {/* Top Decorative Forest & Gold Header Stripe */}
        <View style={styles.topAccentBar} />
        <View style={styles.topGoldStripe} />

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.brandBlock}>
            <Text style={styles.brandTitle}>{nursery.name}</Text>
            <Text style={styles.brandTagline}>
              Horticulture Plants • Farm Nursery & Landscaping
            </Text>
            {nursery.phone || nursery.email ? (
              <Text style={styles.brandMetaRow}>
                {[
                  nursery.phone ? `Ph: ${nursery.phone}` : null,
                  nursery.email ? `Email: ${nursery.email}` : null,
                ]
                  .filter(Boolean)
                  .join("   •   ")}
              </Text>
            ) : null}
          </View>

          <View style={styles.docBlock}>
            <View
              style={[
                styles.docBadge,
                isCancelled
                  ? { backgroundColor: C.danger, borderColor: C.danger }
                  : {},
              ]}
            >
              <Text style={styles.docBadgeText}>{docBadgeTitle}</Text>
            </View>
            <Text style={styles.docNumberText}>
              {invoice.invoiceNumber || "—"}
            </Text>

            <View style={styles.metaGrid}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>
                  {isQuotation ? "Quotation Date:" : "Invoice Date:"}
                </Text>
                <Text style={styles.metaValue}>
                  {date(invoice.invoiceDate || invoice.createdAt)}
                </Text>
              </View>
              {invoice.dueDate ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>
                    {isQuotation ? "Valid Until:" : "Payment Due:"}
                  </Text>
                  <Text style={styles.metaValue}>{date(invoice.dueDate)}</Text>
                </View>
              ) : null}
              {invoice.branchName || invoice.branchId?.name ? (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Dispatch Branch:</Text>
                  <Text style={styles.metaValue}>
                    {invoice.branchName || invoice.branchId?.name}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Billed To / Issued By Luxury Cards */}
        <View style={styles.partyGrid}>
          <View style={styles.partyCard}>
            <View style={styles.partyHeaderRow}>
              <View style={styles.goldDot} />
              <Text style={styles.partyLabel}>Billed To / Consignee</Text>
            </View>
            <Text style={styles.partyName}>{customerName}</Text>
            {invoice.customerSnapshot?.businessName ? (
              <Text style={styles.partyBusinessName}>
                {invoice.customerSnapshot.businessName}
              </Text>
            ) : null}
            {customerPhone ? (
              <Text style={styles.partyText}>Contact: {customerPhone}</Text>
            ) : null}
            {customerAddress ? (
              <Text style={styles.partyText}>{customerAddress}</Text>
            ) : null}
          </View>

          <View style={styles.partyCard}>
            <View style={styles.partyHeaderRow}>
              <View style={styles.goldDot} />
              <Text style={styles.partyLabel}>
                Issued By / Nursery Provider
              </Text>
            </View>
            <Text style={[styles.partyName, { color: C.primary }]}>
              {nursery.name}
            </Text>
            {nursery.phone ? (
              <Text style={styles.partyText}>Direct Line: {nursery.phone}</Text>
            ) : null}
            {nursery.email ? (
              <Text style={styles.partyText}>Inquiries: {nursery.email}</Text>
            ) : null}
            {nurseryAddress ? (
              <Text style={styles.partyText}>{nurseryAddress}</Text>
            ) : null}
          </View>
        </View>

        {/* Plant Items Table */}
        <View style={styles.tableHeadingContainer}>
          <View style={styles.goldDot} />
          <Text style={styles.tableHeadingText}>
            Plant Specifications & Itemized Bill
          </Text>
        </View>

        <View style={styles.tableFrame}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colNo, styles.thText]}>#</Text>
            <Text style={[styles.colItem, styles.thText]}>
              Plant Name & Details
            </Text>
            <Text style={[styles.colVariety, styles.thText]}>
              Variety / Specification
            </Text>
            <Text style={[styles.colQty, styles.thText]}>Quantity</Text>
            <Text style={[styles.colRate, styles.thText]}>Rate (₹)</Text>
            <Text style={[styles.colAmount, styles.thText]}>Amount (₹)</Text>
          </View>

          {invoice.items?.map((item, idx) => (
            <View
              key={item.id || `${item.plantName || "item"}-${idx}`}
              style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
              wrap={false}
            >
              <Text style={styles.colNo}>{idx + 1}</Text>
              <View style={styles.colItem}>
                <Text style={styles.itemTitle}>
                  {item.plantName || item.description || "Plant item"}
                </Text>
                {item.description && item.description !== item.plantName ? (
                  <Text style={styles.itemSub}>{item.description}</Text>
                ) : null}
              </View>
              <View style={styles.colVariety}>
                <Text style={styles.cellText}>
                  {item.variety || "Standard"}
                </Text>
                {item.plantSize ? (
                  <Text style={styles.itemSub}>Size: {item.plantSize}</Text>
                ) : null}
              </View>
              <Text style={[styles.colQty, styles.cellText]}>
                {item.quantity} {item.unitName || "PCS"}
              </Text>
              <Text style={[styles.colRate, styles.cellText]}>
                {money(item.unitPrice)}
              </Text>
              <Text style={styles.colAmount}>{money(item.lineTotal)}</Text>
            </View>
          ))}
        </View>

        {/* Additional Charges / Freight Services */}
        {invoice.charges?.length > 0 ? (
          <View style={styles.chargesBox}>
            <Text style={styles.chargesHeader}>
              Additional Services, Freight & Packing
            </Text>
            {invoice.charges.map((charge, idx) => (
              <View
                key={charge.id || `${charge.name || "charge"}-${idx}`}
                style={styles.chargeRow}
                wrap={false}
              >
                <Text style={styles.chargeName}>
                  • {charge.name || "Additional Service"}
                  {charge.description ? ` (${charge.description})` : ""}
                </Text>
                <Text style={styles.chargeAmount}>+{money(charge.amount)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Bottom Section: Notes & Summary Totals */}
        <View style={styles.bottomGrid}>
          {invoice.notes && (
            <View style={styles.notesCard}>
              <Text style={styles.notesHeading}>
                Delivery Notes & Client Instructions
              </Text>
              <Text style={styles.notesBody}>{invoice.notes}</Text>
              <Text style={styles.paymentNotice}>
                {isQuotation
                  ? "Note: This quotation is an estimate. Rates and plant stock are subject to confirmation at the time of order placement."
                  : "Thank you for your business. Please quote this invoice number for all account settlements."}
              </Text>
            </View>
          )}

          <View style={styles.totalsCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Plant Subtotal</Text>
              <Text style={styles.totalVal}>{money(invoice.subtotal)}</Text>
            </View>

            {Number(invoice.chargesTotal) > 0 ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Freight & Extra Charges</Text>
                <Text style={[styles.totalVal, { color: C.primaryMedium }]}>
                  +{money(invoice.chargesTotal)}
                </Text>
              </View>
            ) : null}

            {Number(invoice.discountAmount) > 0 ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Special Discount Applied</Text>
                <Text style={styles.discountVal}>
                  -{money(invoice.discountAmount)}
                </Text>
              </View>
            ) : null}

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalVal}>
                {money(invoice.grandTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Authorized Signature Block */}
        <View style={styles.signatureGrid}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureSignatoryText}>
              Authorized Signatory
            </Text>
            <Text style={styles.signatureFirmText}>For {nursery.name}</Text>
          </View>
        </View>

        {/* Discreet Professional Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated via NurseryDesk Platform • Horticulture Management
          </Text>
          <Text style={styles.footerText}>
            {isQuotation
              ? "Official Quotation • Not a Tax Invoice"
              : "Computer Generated Invoice • Non-GST"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
