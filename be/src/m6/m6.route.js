import express from 'express';
import M6Controller from './m6.controller.js';
import validate from '../middlewares/validate.js';
import { m6Schema } from './m6.validator.js';
import authenticateToken from '../middlewares/authenticate-token.js';

const m6Router = express.Router();

m6Router.use(authenticateToken);

m6Router.post('/', validate(m6Schema), M6Controller.create);
m6Router.get('/', M6Controller.findAll);
m6Router.get('/:id', M6Controller.findById);
m6Router.put('/:id', validate(m6Schema), M6Controller.update);
m6Router.delete('/:id', M6Controller.remove);

export default m6Router;
