import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { Purchase } from "./Purchase";
import { Book } from "../../inventory_management/entities/Book";

@Entity()
export class PurchaseBook {
   
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Book)
    book: Book;

    @Column()
    quantity: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

}
