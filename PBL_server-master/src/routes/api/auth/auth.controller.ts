import { Request, Response } from "express";
import { getRepository, Repository } from "typeorm";
import { User } from "../../../entity/User";
import jwt = require("jsonwebtoken");

export class AuthController {
    public static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!(email && password)) {
          res.status(400).send("Invalid email or invalid passwords");
        }

        const userRepository: Repository<User> = await getRepository(User);
        try {
          const user = await userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: email })
            .getOne();

            if(user){
              if (!user.isPasswordCorrect(password)) {
                return res.status(401).send("Password error");
              }

              const userInfo = {id: user.id};
              const options = {expiresIn: "1h", issuer: "jynnpark", subject: "userInfo"};            
              const token = await jwt.sign(userInfo, req.app.get('jwt-secret'), options);

              res.status(200).json({
                id: user.id,
                token: token});
            }else{
              res.status(401).send("Account doesn't exist")
            }
        } catch (e) {
            res.status(409).send(e);
        }
    };
};

export default AuthController;

