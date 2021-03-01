import { Router } from 'express';
import { ReservationController } from './reservation.controller';


const reservation = Router();

// for admin
reservation.get('/', ReservationController.getAllReservations);


// for customer 
reservation.post('/', ReservationController.createReservation); // input: available room_id
reservation.post('/code', ReservationController.getReservationByCode);

export default reservation;