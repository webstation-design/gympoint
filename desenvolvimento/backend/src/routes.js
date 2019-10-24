import { Router } from 'express';

import athMiddleWare from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(athMiddleWare);

routes.put('/users', UserController.update);

export default routes;