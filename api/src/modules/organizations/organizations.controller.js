import { Organization, Branch, User, Membership } from "../../models/index.js";
import { z } from "zod";

const updateOrgSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  currency: z.string().default("INR").optional(),
  timezone: z.string().default("Asia/Kolkata").optional(),
  logoUrl: z.string().optional().nullable(),
  address: z
    .union([
      z.string(),
      z.object({
        street: z.string().optional().nullable(),
        line1: z.string().optional().nullable(),
        line2: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        state: z.string().optional().nullable(),
        pincode: z.string().optional().nullable(),
        postalCode: z.string().optional().nullable(),
        country: z.string().optional().nullable(),
      }),
    ])
    .optional()
    .nullable(),
});

// Get organization profile & details
export async function getOrganizationProfile(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const org = await Organization.findById(orgId);
  if (!org) return reply.code(404).send({ success: false, message: "Organization not found" });

  const [branches, employeeCount] = await Promise.all([
    Branch.find({ organizationId: orgId }),
    Membership.countDocuments({ organizationId: orgId, status: "ACTIVE" }),
  ]);

  return reply.send({
    success: true,
    data: {
      ...org.toObject(),
      branches,
      employeeCount,
    },
  });
}

// Update organization profile
export async function updateOrganizationProfile(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const parsed = updateOrgSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }

  const updatedOrg = await Organization.findByIdAndUpdate(
    orgId,
    { $set: parsed.data },
    { new: true }
  );

  if (!updatedOrg) return reply.code(404).send({ success: false, message: "Organization not found" });

  return reply.send({ success: true, message: "Organization updated successfully", data: updatedOrg });
}

// Get organization settings & operational preferences
export async function getOrganizationSettings(request, reply) {
  const orgId = request.headers["x-organization-id"];
  if (!orgId) return reply.code(400).send({ success: false, message: "Organization ID is required" });

  const org = await Organization.findById(orgId).select("currency timezone status name slug logoUrl address");
  if (!org) return reply.code(404).send({ success: false, message: "Organization not found" });

  return reply.send({
    success: true,
    data: {
      currency: org.currency,
      timezone: org.timezone,
      status: org.status,
      nonGstInvoiceEnabled: true,
      inventoryTrackingEnabled: true,
      quotationExpiryDays: 30,
    },
  });
}

