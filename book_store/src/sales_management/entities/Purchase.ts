import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { PurchaseBook } from "./PurchaseBook";
import { Users } from "../../user_management/entities/Users";

@Entity()
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalAmount: number;

    @ManyToOne(() => Users, { onDelete: "CASCADE" })
    user: Users

    @Column({ type: "enum", enum: ["Pending", "Paid", "Failed"], default: "Pending" })
    status: string;

    @ManyToMany(() => PurchaseBook, {cascade: true})
    @JoinTable()
    orderItems: PurchaseBook[]


}
