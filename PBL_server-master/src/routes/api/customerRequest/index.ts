import { Router } from 'express'
import { CustomerRequestController } from './customerRequest.controller';


const request = Router();

request.get('/', CustomerRequestController.getAllRequests);
request.post('/', CustomerRequestController.addCustomerRequestByRoomNumber); // input: roon_number, type, content
request.delete('/', CustomerRequestController.deleteRequest); // input : id list

export default request;