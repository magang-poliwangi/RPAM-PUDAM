/* eslint-disable no-unused-vars */
import response from '../../utils/response.js';

export default class BahayaKontaminasiController {
    constructor({ bahayaKontaminasiService }) {
        this.bahayaKontaminasiService = bahayaKontaminasiService;
    }

    findAllController = async (req, res, next) => {
        const result = await this.bahayaKontaminasiService.findAll({ req });
        return response(res, 200, 'Data berhasil diambil', result);
    };

    findByIdController = async (req, res, next) => {
        const { id } = req.params;
        const data = await this.bahayaKontaminasiService.findById({ id });
        return response(res, 200, 'Data berhasil diambil', data);
    };

    createController = async (req, res, next) => {
        const data = req.validated;
        const result = await this.bahayaKontaminasiService.create({ data, userId: req.user.id });
        return response(res, 201, 'Data berhasil dibuat', result);
    };

    updateController = async (req, res, next) => {
        const { id } = req.params;
        const data = req.validated;
        const result = await this.bahayaKontaminasiService.update({ id, data, userId: req.user.id });
        return response(res, 200, 'Data berhasil diperbarui', result);
    };

    removeController = async (req, res, next) => {
        const { id } = req.params;
        await this.bahayaKontaminasiService.remove({ id, userId: req.user.id });
        return response(res, 200, 'Data berhasil dihapus', null);
    };
}