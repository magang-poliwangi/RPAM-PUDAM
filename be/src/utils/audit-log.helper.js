export async function catatAuditLog(auditLogRepository, { userId, aksi, namaTabel, recordId, keterangan }) {
    try {
        await auditLogRepository.create({
            data: { userId, aksi, namaTabel, recordId, keterangan },
        });
    } catch (err) {
        console.error('Gagal mencatat audit log:', err.message);
    }
}