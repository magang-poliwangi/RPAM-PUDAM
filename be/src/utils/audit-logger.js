import { prisma } from '../databases/client.js';

export async function logAudit(userId, aksi, namaTabel, recordId, oldVal = null, newVal = null) {
  try {
    let keterangan = null;
    if (oldVal || newVal) {
      keterangan = JSON.stringify({
        old: oldVal,
        new: newVal
      });
    }
    await prisma.auditLog.create({
      data: {
        userId,
        aksi,
        namaTabel,
        recordId,
        keterangan
      }
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
}
