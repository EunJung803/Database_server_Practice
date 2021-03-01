import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import { Reservation } from "./Reservation";

@Entity()
export class CustomerRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    type: string;

    @Column({nullable: false})
    content: string;

    @Column({nullable: false, default: false})
    status: boolean;

    @ManyToOne(
        (type) => Reservation,
        (reservation) => reservation.requests
    )
    reservation: Reservation;

}
