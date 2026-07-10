import express from 'express';
import M5Controller from './m5.controller.js';
import validate from '../middlewares/validate.js';
import { m5Schema } from './m5.validator.js';
import authenticateToken from '../middlewares/authenticate-token.js';

const m5Router = express.Router();

m5Router.use(authenticateToken);

m5Router.post('/', validate(m5Schema), M5Controller.create);
m5Router.get('/', M5Controller.findAll);
m5Router.get('/:id', M5Controller.findById);
m5Router.put('/:id', validate(m5Schema), M5Controller.update);
m5Router.delete('/:id', M5Controller.remove);

export default m5Router;
