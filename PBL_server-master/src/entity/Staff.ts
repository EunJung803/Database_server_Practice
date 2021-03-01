import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryColumn} from "typeorm";
import { Room } from "./Room";

@Entity()
export class Staff {
    @PrimaryColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})
    phone: string;

    @Column({nullable: false})
    department: string;

    @Column({nullable: false})
    sub_department: string;

    @Column({nullable: false})
    position: string;

    @Column({nullable: false, default: false})
    attendance: boolean;

    @OneToMany(
        (type) => Room,
        (room) => room.staff
      )
    rooms: Room[];
}
