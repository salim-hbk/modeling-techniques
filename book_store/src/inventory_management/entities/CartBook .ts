import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Cart } from '../../sales_management/entities/Cart';
import { Book } from './Book';


@Entity()
export class CartBook {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Book, { onDelete: 'CASCADE' })
    book: Book;

    @Column({ type: 'int', default: 1 })
    quantity: number; // New column for the quantity of books

    @ManyToOne(()=> Cart, {onDelete: "CASCADE"})
    @JoinColumn()
    cart: Cart
}
