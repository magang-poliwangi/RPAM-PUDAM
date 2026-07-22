/* eslint-disable no-unused-vars */
import { InvariantError } from '../../exceptions/error.js';
import response from '../../utils/response.js';

export default class ExcelController {
  constructor({ excelService }) {
    this.excelService = excelService;
  }

  exportController = async (req, res, next) => {
    const buffer = await this.excelService.generateWorkbook();
    res.setHeader('Content-Disposition', 'attachment; filename="rpam-data.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  };

  importController = async (req, res, next) => {
    if (!req.file) throw new InvariantError('File Excel wajib diunggah');

    const result = await this.excelService.importWorkbook({
      fileBuffer: req.file.buffer,
      userId: req.user.id,
    });

    return response(res, 200, 'Import Excel selesai diproses', result);
  };
}