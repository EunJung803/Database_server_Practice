import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { CustomerRequest } from "../../../entity/CustomerRequest";
import { Reservation } from "../../../entity/Reservation";
import { Room } from "../../../entity/Room";
import { RoomPrice } from "../../../entity/RoomPrice";
import { generateCode, getDays } from "../../../utils";

export class ReservationController {
    public static getAllReservations = async (req: Request, res: Response) => {
        const reservationRepository: Repository<Reservation> = await getRepository(Reservation);
        try {
            const reservations = await reservationRepository
                .createQueryBuilder('reservation')
                .getMany(); 
        
            res.send(reservations);
        } catch (e) {
            res.status(404).send();
        }
    };

    public static getReservationByCode = async (req: Request, res: Response) => {
        const { code } = req.body;
        const reservationRepository: Repository<Reservation> = await getRepository(Reservation);
        try {
            const reserve = await reservationRepository
                .createQueryBuilder('reservation')
                .where('reservation.code = :code', { code })
                .getOne();
            
            if(reserve){
                res.status(200).send(reserve);
            }else{
                res.status(404).send('User not found');
            }
        } catch (e) {
            res.status(404).send(e);
        }
    };

    public static createReservation = async (req: Request, res: Response) => {
        const {first_name, 
                last_name, 
                email, 
                contact, 
                region, 
                payment, 
                payment_number, 
                payment_exp, 
                adults, 
                infants, 
                checkin, 
                checkout, 
                request, 
                breakfast, 
                parking,
                room_id} = req.body;

        const reserve = new Reservation();
        reserve.first_name = first_name;
        reserve.last_name = last_name;
        reserve.email = email;
        reserve.contact = contact;
        reserve.region = region;
        reserve.payment = payment;
        reserve.payment_number = payment_number;
        reserve.payment_exp = payment_exp;
        reserve.adults = adults;
        reserve.infants = infants;
        reserve.checkin = checkin;
        reserve.checkout = checkout;
        reserve.breakfast = breakfast;
        reserve.parking = parking;
        reserve.code = generateCode();

        const reservationRepository: Repository<Reservation> = await getRepository(Reservation);
        const roomRepository: Repository<Room> = await getRepository(Room);
        const customerRequestRepository:Repository<CustomerRequest> = await getRepository(CustomerRequest);
        const roomPriceRepository:Repository<RoomPrice> = await getRepository(RoomPrice);
        try {
            const reservedRoom = await roomRepository
                .createQueryBuilder('room')
                .where('room.id = :id', {id: room_id})
                .getOne();

            reservedRoom.status = "reserved";     
            reserve.room = reservedRoom;
            
            // 해당 예약에 대한 initial 요청사항 입력
            const prerequest = new CustomerRequest();
            prerequest.type = "initial";
            prerequest.content = request;
            prerequest.reservation = reserve;
        
         

            // 해당 예약 건에 대한 객실 요금 조회
            let ncheckout = new Date(checkout);
            let ncheckin = new Date(checkin);
    
            let month = ncheckout.getMonth() - ncheckin.getMonth();
            let date = ncheckout.getDate() - ncheckin.getDate();

            let nights = getDays(month) + date;

            const currentPrice = await roomPriceRepository 
                .createQueryBuilder('price')
                .where('price.type = :type', {type: reservedRoom.type})
                .getOne();
            
            reserve.price = nights * currentPrice.price;
   

            await roomRepository.save(reservedRoom);
            await reservationRepository.save(reserve);         
            await customerRequestRepository.save(prerequest);

            res.status(201).json({
                code: reserve.code
            });
        } catch (e) {
            res.status(409).send(e);
        }
     };
}