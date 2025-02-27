import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";



@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    checkInDate: Date;

    @Column()
    checkOutDate: Date;

    @ManyToOne(() => Customer, customer => customer.bookings)
    customer: Customer;
}