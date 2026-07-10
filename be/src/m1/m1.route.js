import express from 'express';
import M1Controller from './m1.controller.js';
import validate from '../middlewares/validate.js';
import { m1Schema } from './m1.validator.js';
import authenticateToken from '../middlewares/authenticate-token.js';

const m1Router = express.Router();

m1Router.use(authenticateToken);

m1Router.post('/', validate(m1Schema), M1Controller.create);
m1Router.get('/', M1Controller.findAll);
m1Router.get('/:id', M1Controller.findById);
m1Router.put('/:id', validate(m1Schema), M1Controller.update);
m1Router.delete('/:id', M1Controller.remove);

export default m1Router;
