import "server-only";
import { prisma } from "./db";

/** Record an admin action in the audit log. Never throws into the caller. */
export async function audit(params: {
  adminId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  detail?: string | null;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: params.adminId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        detail: params.detail ?? null,
      },
    });
  } catch {
    // auditing must not break the primary operation
  }
}
