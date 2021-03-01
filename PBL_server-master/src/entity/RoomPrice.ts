import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";

@Entity()
export class RoomPrice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    price: number;

    @Column({nullable: false})
    floor: number;

    @Column({nullable: false})
    type: string; // standard, deluxe, vip

}
