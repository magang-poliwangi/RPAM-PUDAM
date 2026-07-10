import express from 'express';
import M2Controller from './m2.controller.js';
import validate from '../middlewares/validate.js';
import { m2Schema } from './m2.validator.js';
import authenticateToken from '../middlewares/authenticate-token.js';

const m2Router = express.Router();

m2Router.use(authenticateToken);

m2Router.post('/', validate(m2Schema), M2Controller.create);
m2Router.get('/', M2Controller.findAll);
m2Router.get('/:id', M2Controller.findById);
m2Router.put('/:id', validate(m2Schema), M2Controller.update);
m2Router.delete('/:id', M2Controller.remove);

export default m2Router;
