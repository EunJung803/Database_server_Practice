import { Router } from 'express';
import { UserController } from './user.controller';


const user = Router();

user.get('/', UserController.getAllUsers);
user.get('/:id', UserController.getUserById);
user.post('/', UserController.createUser);
user.post('/name', UserController.getUserByName);

export default user;