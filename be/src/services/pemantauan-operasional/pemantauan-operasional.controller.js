// pemantauanOperasional.controller.js
/* eslint-disable no-unused-vars */
import response from '../../utils/response.js';

export default class PemantauanOperasionalController {
    constructor({ pemantauanOperasionalService }) {
        this.pemantauanOperasionalService = pemantauanOperasionalService;
    }

    getDropdownKajiUlangRisikoController = async (req, res, next) => {
        const data = await this.pemantauanOperasionalService.getDropdownKajiUlangRisiko();
        return response(res, 200, 'Daftar kaji ulang risiko tersedia', data);
    };

    findAllController = async (req, res, next) => {
        const result = await this.pemantauanOperasionalService.findAll({ req });
        return response(res, 200, 'Data berhasil diambil', result);
    };

    findByIdController = async (req, res, next) => {
        const { id } = req.params;
        const data = await this.pemantauanOperasionalService.findById({ id });
        return response(res, 200, 'Data berhasil diambil', data);
    };

    createController = async (req, res, next) => {
        const data = req.validated;
        const result = await this.pemantauanOperasionalService.create({ data, userId: req.user.id });
        return response(res, 201, 'Pemantauan operasional berhasil dibuat', result);
    };

    updateController = async (req, res, next) => {
        const { id } = req.params;
        const data = req.validated;
        const result = await this.pemantauanOperasionalService.update({ id, data, userId: req.user.id });
        return response(res, 200, 'Pemantauan operasional berhasil diperbarui', result);
    };

    removeController = async (req, res, next) => {
        const { id } = req.params;
        await this.pemantauanOperasionalService.remove({ id, userId: req.user.id });
        return response(res, 200, 'Pemantauan operasional berhasil dihapus', null);
    };
}