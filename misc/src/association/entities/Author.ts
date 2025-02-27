import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Book, (book) => book.authors)
  books: Book[];
}   