import express from 'express';
import M4Controller from './m4.controller.js';
import validate from '../middlewares/validate.js';
import { m4Schema } from './m4.validator.js';
import authenticateToken from '../middlewares/authenticate-token.js';

const m4Router = express.Router();

m4Router.use(authenticateToken);

m4Router.post('/', validate(m4Schema), M4Controller.create);
m4Router.get('/', M4Controller.findAll);
m4Router.get('/:id', M4Controller.findById);
m4Router.put('/:id', validate(m4Schema), M4Controller.update);
m4Router.delete('/:id', M4Controller.remove);

export default m4Router;
