import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const usersRouter = Router();

const sessionsController = new SessionsController();

usersRouter.post('/', celebrate({
  [Segments.BODY]: {
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }
}), sessionsController.create);

export default usersRouter;
