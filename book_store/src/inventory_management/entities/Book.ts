import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable, JoinColumn, ManyToMany, VersionColumn } from "typeorm";
import { Category } from "./Category";
import { Users } from "../../user_management/entities/Users";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column("text")
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Users, { onDelete: "CASCADE" })
    @JoinColumn({ name: "author_id" })
    author: Users;

    @ManyToMany(() => Category, { cascade: true })
    @JoinTable()
    categories: Category[];

    @Column()
    inStock: number

    @VersionColumn()
    version: number


}
