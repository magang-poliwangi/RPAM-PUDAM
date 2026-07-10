import express from 'express';
import pemantauanOperasionalRoute from './routes/pemantauan-operasional.route.js';

const Routers = express.Router();

Routers.use('/pemantauan', pemantauanOperasionalRoute); // path sesuai api.md §5.5

export default Routers;