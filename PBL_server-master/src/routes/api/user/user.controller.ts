import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { User } from "../../../entity/User";

export class UserController {
  public static getAllUsers = async (req: Request, res: Response) => {
    const userRepository: Repository<User> = await getRepository(User);
    try {
      const users = await userRepository
        .createQueryBuilder('user')
        .getMany(); 

      res.send(users);
    } catch (e) {
      res.status(404).send();
    }
  };

  public static getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userRepository: Repository<User> = await getRepository(User);
    try {
      const user = await userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();
        
      if(user){
        res.status(200).send(user);
      }else{
        res.status(404).send('User not found');
      }
    } catch (e) {
      res.status(404).send(e);
    }
  };

  public static getUserByName = async (req: Request, res: Response) => {
    const { name } = req.body;
    const userRepository: Repository<User> = await getRepository(User);
    try {
      const user = await userRepository
        .createQueryBuilder('user')
        .where('user.name = :name', { name: name })
        .getOne();
        
      if(user){
        res.status(200).send(user);
      }else{
        res.status(404).send('User not found');
      }
    } catch (e) {
      res.status(404).send(e);
    }
  }

  public static createUser = async (req: Request, res: Response) => {
    const {name, email, password} = req.body;
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;

    user.hashPassword();
    const userRepository: Repository<User> = await getRepository(User);
    try {
        await userRepository.save(user);
        res.status(201).send('User created!');
    } catch (e) {
        res.status(409).send(e);
    }
  };
}