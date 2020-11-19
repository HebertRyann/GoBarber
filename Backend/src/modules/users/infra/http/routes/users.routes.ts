import { Router } from 'express';
import multer from 'multer';
import { celebrate, Segments, Joi } from 'celebrate';


import ensureAutheticated from '../middlewares/ensureAutheticated';
import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import UsersAvatarController from '../controllers/UsersAvatarController';

const usersRouter = Router();


const upload = multer(uploadConfig);
const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

usersRouter.post('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string(),
  }
}), usersController.create);

usersRouter.patch('/avatar', ensureAutheticated, upload.single('avatar'), usersAvatarController.update)
export default usersRouter;
