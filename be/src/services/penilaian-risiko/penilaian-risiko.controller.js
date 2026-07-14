
/* eslint-disable no-unused-vars */
import response from '../../utils/response.js';

export default class PenilaianRisikoController {
    constructor({ penilaianRisikoService }) {
        this.penilaianRisikoService = penilaianRisikoService;
    }

    createController = async (req, res, next) => {
        const data = req.validated;
        const result = await this.penilaianRisikoService.create({ data, userId: req.user.id });
        return response(res, 201, 'Data penilaian risiko berhasil ditambahkan', result);
    };

    findAllController = async (req, res, next) => {
        const result = await this.penilaianRisikoService.findAll({ req });
        return response(res, 200, 'Data penilaian risiko berhasil diambil', result);
    };

    findByIdController = async (req, res, next) => {
        const { id } = req.params;
        const result = await this.penilaianRisikoService.findById({ id });
        return response(res, 200, 'Data penilaian risiko berhasil diambil', result);
    };

    updateController = async (req, res, next) => {
        const { id } = req.params;
        const data = req.validated;
        const result = await this.penilaianRisikoService.update({ id, data, userId: req.user.id });
        return response(res, 200, 'Data penilaian risiko berhasil diupdate', result);
    };

    removeController = async (req, res, next) => {
        const { id } = req.params;
        await this.penilaianRisikoService.remove({ id, userId: req.user.id });
        return response(res, 200, 'Data penilaian risiko berhasil dihapus', null);
    };
}