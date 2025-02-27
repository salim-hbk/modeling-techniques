import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Booking } from "./Booking";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @OneToMany(() => Booking, booking => booking.customer)
    bookings: Booking[];
}
