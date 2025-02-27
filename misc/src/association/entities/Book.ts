import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "./Author";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Author, (author) => author.books, {cascade: true, onDelete: 'CASCADE'})
  @JoinTable()
  authors: Author[];

}