import { FileRecord } from "../../models/FileRecord.js";
import { z } from "zod";

const registerFileSchema = z.object({
  originalName: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().nonnegative(),
  url: z.string().min(1),
  category: z
    .enum(["PLANT_IMAGE", "BUSINESS_DOC", "INVOICE_PDF", "RECEIPT_PDF", "QUOTATION_PDF", "EXPENSE_RECEIPT", "GENERAL"])
    .default("GENERAL"),
  entityType: z.string().optional().nullable(),
  entityId: z.string().optional().nullable(),
});

// List files belonging to the organization
export async function listFiles(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const { category, entityType, entityId } = request.query || {};
  const query = { organizationId: orgId };

  if (category) query.category = category;
  if (entityType) query.entityType = entityType;
  if (entityId) query.entityId = entityId;

  const files = await FileRecord.find(query).sort({ createdAt: -1 });
  return reply.send({ success: true, data: files });
}

// Register or metadata-record an uploaded file (e.g. uploaded via cloud or local static assets)
export async function registerFile(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = registerFileSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const file = await FileRecord.create({
    ...parsed.data,
    organizationId: orgId,
  });

  return reply.code(201).send({ success: true, data: file });
}

// Get file record by ID
export async function getFileById(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const file = await FileRecord.findOne({ _id: request.params.id, organizationId: orgId });
  if (!file) return reply.code(404).send({ success: false, message: "File record not found" });

  return reply.send({ success: true, data: file });
}

// Delete file record
export async function deleteFile(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const file = await FileRecord.findOneAndDelete({ _id: request.params.id, organizationId: orgId });
  if (!file) return reply.code(404).send({ success: false, message: "File record not found" });

  return reply.send({ success: true, message: "File record deleted successfully" });
}

