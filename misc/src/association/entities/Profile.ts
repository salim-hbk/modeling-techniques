import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    age: number;
    @Column()
    bio: string;
    @OneToOne(() => User, user => user.profile, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: User;

}