import { Router } from 'express';
import { RoomController } from './room.controller';


const room = Router();

// for admin
room.get('/', RoomController.getAllRooms);
room.get('/:number', RoomController.getRoomByRoomNumber);
room.post('/', RoomController.addRoom);
room.post('/staff/:id', RoomController.updateRoomStaff); // input : staff_id
room.post('/check/:id', RoomController.checkRoomById);

// for customer
room.post('/search', RoomController.getRoomsAvailableByDate); // input : checkin, checkout

export default room;