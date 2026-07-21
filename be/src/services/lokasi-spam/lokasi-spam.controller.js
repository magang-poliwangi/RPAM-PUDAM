// pemantauanOperasional.controller.js
/* eslint-disable no-unused-vars */
import response from '../../utils/response.js';

export default class LokasiSpamController {
    constructor({ lokasiSpamService }) {
        this.lokasiSpamService = lokasiSpamService;
    }

    findAllController = async (req, res, next) => {
        const result = await this.lokasiSpamService.findAll({ req });
        return response(res, 200, 'Data berhasil diambil', result);
    };

    getFilterOptionsController = async (req, res) => {
        const result = await this.lokasiSpamService.getFilterOptions();

        return response(
            res,
            200,
            "Filter berhasil diambil",
            result
        );
    };

    findByIdController = async (req, res, next) => {
        const { id } = req.params;
        const data = await this.lokasiSpamService.findById({ id });
        return response(res, 200, 'Data berhasil diambil', data);
    };

    createController = async (req, res, next) => {
        const data = req.validated;
        const result = await this.lokasiSpamService.create({ data, userId: req.user.id });
        return response(res, 201, 'Lokasi Spam berhasil dibuat', result);
    };

    updateController = async (req, res, next) => {
        const { id } = req.params;
        const data = req.validated;
        const result = await this.lokasiSpamService.update({ id, data, userId: req.user.id });
        return response(res, 200, 'Lokasi Spam berhasil diperbarui', result);
    };

    removeController = async (req, res, next) => {
        const { id } = req.params;
        await this.lokasiSpamService.remove({ id, userId: req.user.id });
        return response(res, 200, 'Lokasi Spam berhasil dihapus', null);
    };
}