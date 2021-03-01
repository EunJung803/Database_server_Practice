import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne} from "typeorm";
import { Reservation } from "./Reservation";
import { Staff } from "./Staff";

@Entity()
export class Room {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    number: number;

    @Column({nullable: false})
    floor: number;

    @Column({nullable: false})
    type: string;

    @Column({nullable: false, default: "empty"}) // current status
    status: string;

    @Column({nullable: false, default: false})
    cleaning_status: boolean;

    @ManyToOne(
        (type) => Staff,
        (staff) => staff.rooms
    )
    staff: Staff;

    @OneToMany(
        (type) => Reservation,
        (reservation) => reservation.room
      )
    reservations: Reservation[];
}
