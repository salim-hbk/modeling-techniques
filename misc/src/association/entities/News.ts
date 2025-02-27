import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class News{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    content: string;
    
    @ManyToOne(()=> User, user => user.news, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;
}