/* eslint-disable no-unused-vars */
import response from '../../utils/response.js';

export default class IdentifikasiDanKejadianBahayaController {
    constructor({ identifikasiDanKejadianBahayaService }) {
        this.identifikasiDanKejadianBahayaService = identifikasiDanKejadianBahayaService;
    }

    createController = async (req, res, next) => {
        const data = req.validated;
        const result = await this.identifikasiDanKejadianBahayaService.create({ data, userId: req.user.id });
        return response(res, 201, 'Data identifikasi bahaya berhasil ditambahkan', result);
    };

    findAllController = async (req, res, next) => {
        const result = await this.identifikasiDanKejadianBahayaService.findAll({ req });
        return response(res, 200, 'Data identifikasi bahaya berhasil diambil', result);
    };

    findByIdController = async (req, res, next) => {
        const { id } = req.params;
        const result = await this.identifikasiDanKejadianBahayaService.findById({ id });
        return response(res, 200, 'Data identifikasi bahaya berhasil diambil', result);
    };

    updateController = async (req, res, next) => {
        const { id } = req.params;
        const data = req.validated;
        const result = await this.identifikasiDanKejadianBahayaService.update({ id, data, userId: req.user.id });
        return response(res, 200, 'Data identifikasi bahaya berhasil diupdate', result);
    };

    removeController = async (req, res, next) => {
        const { id } = req.params;
        await this.identifikasiDanKejadianBahayaService.remove({ id, userId: req.user.id });
        return response(res, 200, 'Data identifikasi bahaya berhasil dihapus', null);
    };
}