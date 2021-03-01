import * as bcrypt from 'bcrypt';
import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import { Reservation } from './Reservation';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  name: string;

  @Column({unique: true})
  email: string;

  @Column({select: false})
  password: string;

  @CreateDateColumn({ name: 'created_at', type: "timestamp", select: false })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: "timestamp", select: false })
  updatedAt!: Date;

  // @OneToMany(
  //     (type) => Reservation,
  //     (reservation) => reservation.user
  //   )
  // reservations: Reservation[];

  public hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  public isPasswordCorrect(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }

}
