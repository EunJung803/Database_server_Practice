import { Request, Response } from "express";
import { Repository, getRepository } from "typeorm";
import { Staff } from "../../../entity/Staff";

export class StaffController {
    public static getAllStaffs = async (req: Request, res: Response) => {
        const staffRepository: Repository<Staff> = await getRepository(Staff);
        try {
            const staffs = await staffRepository
                .createQueryBuilder('staff')
                .getMany(); 
        
            res.send(staffs);
        } catch (e) {
          res.status(404).send();
        }
    };

    public static getStaffById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const staffRepository: Repository<Staff> = await getRepository(Staff);
        try {
            const staffs = await staffRepository
                .createQueryBuilder('user')
                .where('user.id = :id', { id })
                .getOne();
            
            if(staffs){
                res.status(200).send(staffs);
            }else{
                res.status(404).send('Staff not found');
            }
        } catch (e) {
          res.status(404).send(e);
        }
    };

    public static addStaff = async (req: Request, res: Response) => {  
        const {id, name, phone, department, sub_department, position} = req.body;       
        const staffRepository: Repository<Staff> = await getRepository(Staff);
        const newStaff = new Staff();
        newStaff.id = id;
        newStaff.name = name;
        newStaff.phone = phone;
        newStaff.department = department;
        newStaff.sub_department = sub_department;
        newStaff.position = position;
        newStaff.attendance = false;
    
        try {
            await staffRepository.save(newStaff);  
            res.status(201).send('Add staff');
        } catch (e) {
            res.status(409).send(e);
        }
    };

    public static updateStaffAttendance = async (req: Request, res: Response) => {  
        const id = req.params.id;
        const { attendance } = req.body;
        const staffRepository: Repository<Staff> = await getRepository(Staff);
        try {
            let staff = await staffRepository.findOne(id);
            staff.attendance = attendance;

            await staffRepository.update(id, staff);
            res.status(201).send('Absent');
        } catch (e) {
            res.status(404).send(e);
        }
    };
}