import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany} from "typeorm";
import { CustomerRequest } from "./CustomerRequest";
import { Room } from "./Room";
import { User } from "./User";

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    first_name: string;

    @Column({nullable: false})
    last_name: string;

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    contact: string;

    @Column({nullable: false})
    region: string;

    @Column({nullable: false})
    price: number;

    @Column({nullable: false, default: "credit"})
    payment: string;

    @Column({nullable: false})
    payment_number: string;

    @Column({nullable: false})
    payment_exp: string;

    @Column({nullable: false, default: 1})
    adults: number;

    @Column({default: 0})
    infants: number;

    @Column({nullable: false, type: 'date'})
    checkin: Date;

    @Column({nullable: false, type: 'date'})
    checkout: Date;

    @Column({default: 0})
    breakfast: number;

    @Column({default: 0})
    parking: number;

    @Column({nullable: false})
    code: string;
    
    @CreateDateColumn({ name: 'created_at', type: "timestamp", select: false })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: "timestamp", select: false })
    updatedAt!: Date;

    @ManyToOne(
        (type) => Room,
        (room) => room.reservations
    )
    room: Room;

    // @ManyToOne(
    //     (type) => User,
    //     (user) => user.reservations
    // )
    // user: User;

    @OneToMany(
        (type) => CustomerRequest,
        (request) => request.reservation,
      )
    requests: CustomerRequest[];
}
