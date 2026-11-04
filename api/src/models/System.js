import mongoose from "mongoose";

const documentSequenceSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    documentType: { type: String, required: true },
    financialYear: { type: String, required: true },
    prefix: { type: String, required: true },
    nextNumber: { type: Number, default: 1 },
  },
  { timestamps: true }
);

documentSequenceSchema.index(
  { organizationId: 1, branchId: 1, documentType: 1, financialYear: 1 },
  { unique: true }
);

export const DocumentSequence = mongoose.model("DocumentSequence", documentSequenceSchema);

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

const auditLogSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null, index: true },
    actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    action: { type: String, required: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, default: null, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    ipAddress: { type: String, default: null },
  },
  { timestamps: true }
);

auditLogSchema.index({ organizationId: 1, createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);

