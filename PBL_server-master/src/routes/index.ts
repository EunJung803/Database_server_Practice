import { Router } from 'express'
import auth from './api/auth';
import user from './api/user';
import reservation  from './api/reservation';
import room from './api/room';
import staff from './api/staff';
import request from './api/customerRequest';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/reservation', reservation);
routes.use('/room', room);
routes.use('/staff', staff);
routes.use('/request', request);

export default routes;