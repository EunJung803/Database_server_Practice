import { Router } from 'express';
import { StaffController } from './staff.controller';


const staff = Router();

staff.get('/', StaffController.getAllStaffs);
staff.get('/:id', StaffController.getStaffById);
staff.post('/', StaffController.addStaff);
staff.post('/attendance/:id', StaffController.updateStaffAttendance);

export default staff;