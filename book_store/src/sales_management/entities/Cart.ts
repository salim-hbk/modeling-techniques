import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Users } from "../../user_management/entities/Users";
import { CartBook } from "../../inventory_management/entities/CartBook ";


@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, { onDelete: "CASCADE" })
    user: Users;

    @OneToMany(() => CartBook, cartBook => cartBook.cart, { cascade: true})
    cartBooks: CartBook[]; // One-to-Many with the CartBook entity
}
