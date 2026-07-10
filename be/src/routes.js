import express from 'express';
import authRouter from './auth/auth.route.js';
import m1Router from './m1/m1.route.js';
import m2Router from './m2/m2.route.js';
import m4Router from './m4/m4.route.js';
import m5Router from './m5/m5.route.js';
import m6Router from './m6/m6.route.js';
import miscRouter from './misc/misc.route.js';

const Routers = express.Router();

Routers.use('/auth', authRouter);
Routers.use('/identifikasi-bahaya', m1Router);
Routers.use('/penilaian-risiko', m2Router);
Routers.use('/m4', m4Router);
Routers.use('/m5', m5Router);
Routers.use('/pemantauan', m6Router);
Routers.use('/', miscRouter);

export default Routers;