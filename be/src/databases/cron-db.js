// import cron from 'node-cron';
// import { prisma } from './client.js';
// import logger from '../utils/logger.js';

// // Hard-delete records yang sudah soft-deleted lebih dari 30 hari
// // Berjalan setiap hari jam 02:00 dini hari
// const RETENSI_HARI = 30;

// cron.schedule('0 2 * * *', async () => {
//     const batas = new Date();
//     batas.setDate(batas.getDate() - RETENSI_HARI);

//     logger.info(`[cron-db] Menjalankan purge soft-deleted records (deletedAt < ${batas.toISOString()})`);

//     try {

//         const rencana = await prisma.rencanaPerbaikan.deleteMany({
//             where: { deletedAt: { lt: batas } },
//         });
//         const pemantauan = await prisma.pemantauanOperasional.deleteMany({
//             where: { deletedAt: { lt: batas } },
//         });


//         const kajiUlang = await prisma.kajiUlangRisiko.deleteMany({
//             where: { deletedAt: { lt: batas } },
//         });


//         const penilaian = await prisma.penilaianRisiko.deleteMany({
//             where: { deletedAt: { lt: batas } },
//         });


//         const identifikasi = await prisma.identifikasiDanKejadianBahaya.deleteMany({
//             where: { deletedAt: { lt: batas } },
//         });


//         const lokasiSpam = await prisma.lokasiSpam.deleteMany({
//             where: { deletedAt: { lt: batas } },
//         });
//         const bahayaKontaminasi = await prisma.bahayaKontaminasi.deleteMany({
//             where: { deletedAt: { lt: batas } },
//         });

//         logger.info('[cron-db] Purge selesai:', {
//             rencanaPerbaikan: rencana.count,
//             pemantauanOperasional: pemantauan.count,
//             kajiUlangRisiko: kajiUlang.count,
//             penilaianRisiko: penilaian.count,
//             identifikasiDanKejadianBahaya: identifikasi.count,
//             lokasiSpam: lokasiSpam.count,
//             bahayaKontaminasi: bahayaKontaminasi.count,
//         });
//     } catch (err) {
//         logger.error('[cron-db] Purge gagal:', err);
//     }
// }, {
//     timezone: 'Asia/Jakarta',
// });

// logger.info('[cron-db] Cron job purge soft-delete terdaftar (setiap hari 02:00 WIB, retensi 30 hari)');
