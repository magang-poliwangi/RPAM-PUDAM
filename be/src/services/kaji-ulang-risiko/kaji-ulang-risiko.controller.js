/* eslint-disable no-unused-vars */
import response from '../../utils/response.js';

export default class KajiUlangRisikoController {
    constructor({ kajiUlangRisikoService }) {
        this.kajiUlangRisikoService = kajiUlangRisikoService;
    }

    createController = async (req, res, next) => {
        const data = req.validated;
        const result = await this.kajiUlangRisikoService.create({ data, userId: req.user.id });
        return response(res, 201, 'Data berhasil ditambahkan', result);
    };

    findAllController = async (req, res, next) => {
        const result = await this.kajiUlangRisikoService.findAll({ req });
        return response(res, 200, 'Data berhasil diambil', result);
    };

    findByIdController = async (req, res, next) => {
        const { id } = req.params;
        const result = await this.kajiUlangRisikoService.findById({ id });
        return response(res, 200, 'Data berhasil diambil', result);
    };

    updateController = async (req, res, next) => {
        const { id } = req.params;
        const data = req.validated;
        const result = await this.kajiUlangRisikoService.update({ id, data, userId: req.user.id });
        return response(res, 200, 'Data berhasil diupdate', result);
    };

    removeController = async (req, res, next) => {
        const { id } = req.params;
        await this.kajiUlangRisikoService.remove({ id, userId: req.user.id });
        return response(res, 200, 'Data berhasil dihapus', null);
    };
}
