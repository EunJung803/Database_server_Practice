import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { Room } from "../../../entity/Room";
import { Staff } from "../../../entity/Staff";
import { getDays } from "../../../utils";

export class RoomController {
    public static getAllRooms = async (req: Request, res: Response) => {
        const roomRepository: Repository<Room> = await getRepository(Room);
        try {
            const rooms = await roomRepository
                .createQueryBuilder('room')
                .getMany(); 
        
            res.send(rooms);
        } catch (e) {
            res.status(404).send();
        }
    };


    public static getRoomByRoomNumber = async (req: Request, res: Response) => {
        const number = req.params.number;

        const roomRepository: Repository<Room> = await getRepository(Room);
        try {
            const room = await roomRepository
                .createQueryBuilder('room')
                .where('room.number = :number', {number: number})
                .getOne(); 
        
            res.send(room);
        } catch (e) {
            res.status(404).send();
        }
    };

    public static getRoomsAvailableByDate = async (req: Request, res: Response) => {
        const {checkin, checkout} = req.body;
        const ncheckout = new Date(checkout);
        const ncheckin = new Date(checkin);

        const year = ncheckout.getFullYear() - ncheckin.getFullYear(); // 1년 이상 예약은 불가능하도록 처리 11.21 ~ 11.24 3박 21,22,23 1박당 10만원 * nights
        const month = ncheckout.getMonth() - ncheckin.getMonth();
        const date = ncheckout.getDate() - ncheckin.getDate();

        const nights = getDays(month) + date;

        const roomRepository: Repository<Room> = await getRepository(Room);
        try {
            const allRooms = await roomRepository
                .createQueryBuilder('room')
                .getMany(); 

            let targetDate = ncheckin;
            let nonAvailableRooms = [];

            for(let i = 0; i < nights; i++){
                let dateStr = targetDate.getFullYear()+"-"+(targetDate.getMonth()+1)+"-"+(targetDate.getDate()+i);
                const reservedRooms = await roomRepository
                    .createQueryBuilder('room')
                    .leftJoinAndSelect('room.reservations', 'reserve')
                    .where('reserve.checkin = :checkin', {checkin: dateStr})
                    .getMany();

                if(reservedRooms){
                    for(let j=0; j<reservedRooms.length; j++){
                        nonAvailableRooms.push(reservedRooms[j]);
                    }
                }            
            }
        
            const availableRooms = allRooms.filter(room => !(nonAvailableRooms.some(booked => booked.id === room.id)));

            if(availableRooms){
                res.status(200).send(availableRooms);
            }else{
                res.status(404).send('No rooms available');
            }
        } catch (e) {
            res.status(404).send(e);
        }
    };

    public static addRoom = async (req: Request, res: Response) => {
      //  const {number, floor, type} = req.body;
       
        const roomRepository: Repository<Room> = await getRepository(Room);
        try {
            for(let i=1; i<=10; i++){
                const room = new Room();
                room.number = 1000+i;
                room.floor = 10;
                room.type = "deluxe";
               
              await roomRepository.save(room);
            }
          
        } catch (e) {
            res.status(409).send(e);
        }
        res.status(201).send('Add room information success');
    };


    public static updateRoomStaff = async (req: Request, res: Response) => {
        const id = req.params.id;
        const {staff_id} = req.body;
        const roomRepository: Repository<Room> = await getRepository(Room);
        const staffRepository: Repository<Staff> = await getRepository(Staff);
        try {
            const staff = await staffRepository
                .createQueryBuilder('staff')
                .where('staff.id = :id', {id: staff_id})
                .getOne();
            
            let room = await roomRepository.findOne(id);
            room.staff = staff;

            await roomRepository.update(id, room);
            res.status(201).send('Update room staff');
        } catch (e) {
            res.status(404).send(e);
        }
      };
  

    public static checkRoomById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { status } = req.body; //checkin or checkout
        const roomRepository: Repository<Room> = await getRepository(Room);
        try {
            let room = await roomRepository.findOne(id);
            room.status = status;

            await roomRepository.update(id, room);
            res.status(201).send('Checkout');
        } catch (e) {
            res.status(404).send(e);
        }
    }
}