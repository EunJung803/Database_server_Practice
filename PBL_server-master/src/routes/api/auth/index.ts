import { Router } from 'express'
import AuthController from './auth.controller';


const auth = Router();

auth.post('/login', AuthController.login);

export default auth;