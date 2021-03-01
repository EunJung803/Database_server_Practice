import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { CustomerRequest } from "../../../entity/CustomerRequest";
import { Reservation } from "../../../entity/Reservation";
import { Room } from "../../../entity/Room";

export class CustomerRequestController {
    public static getAllRequests = async (req: Request, res: Response) => {
        const customerRequestRepository: Repository<CustomerRequest> = await getRepository(CustomerRequest);
        const reservationRepository: Repository<Reservation> = await getRepository(Reservation);
        const roomRepository: Repository<Room> = await getRepository(Room);

        try {
            let requestMatch = [];
            const requests = await customerRequestRepository
                .createQueryBuilder('request')
                .where('request.content != :content',{content: ""})
                .getMany(); 

            await requests.forEach(async (request, index) => {
                const reserve = await reservationRepository
                    .createQueryBuilder('reserve')
                    .leftJoinAndSelect('reserve.requests', 'request')
                    .where('request.id = :qid', {qid: request.id})
                    .getOne();
                
                const room = await roomRepository
                    .createQueryBuilder('room')
                    .leftJoinAndSelect('room.reservations', 'reserve')
                    .where('reserve.id = :id', {id: reserve.id})
                    .getOne();
          
                requestMatch.push({
                    id: request.id,
                    type: request.type,
                    content: request.content,
                    room: room
                });
                if(index === requests.length -1){
                    res.status(201).send(requestMatch);
                }
            })
        } catch (e) {
          res.status(404).send();
        }
    }

    public static addCustomerRequestByRoomNumber = async (req: Request, res: Response) => {
        const {room_number, type, content} = req.body;

        const reservationRepository: Repository<Reservation> = await getRepository(Reservation);
        const customerRequestRepository: Repository<CustomerRequest> = await getRepository(CustomerRequest);
        try {
            const targetReservation = await reservationRepository
                .createQueryBuilder('reserve')
                .leftJoinAndSelect('reserve.room', 'room')
                .where('room.number =:number AND room.status =:status', {number: room_number, status: "reserved"}) // 투숙중인 객실 대상
                .getOne();

            if(targetReservation){
                const newRequest = new CustomerRequest();
                newRequest.type = type;
                newRequest.content = content;
                newRequest.reservation = targetReservation;

                await customerRequestRepository.save(newRequest);
                res.status(200).send('New request applied !');
            }else{
                res.status(404).send();
            }
        } catch (e) {
            res.status(404).send(e);
        }
    }

    public static deleteRequest = async (req: Request, res: Response) => {
        const {ids} = req.body;
        const customerRequestRepository: Repository<CustomerRequest> = await getRepository(CustomerRequest);
        for(let i=0; i<ids.length; i++){
            try {
                await customerRequestRepository.findOneOrFail(ids[i]);
            } catch (e) {
                res.status(404).send(e);
            }
            await customerRequestRepository.delete(ids[i]);
        }
        res.status(200).send('Request all clear');
    };
}