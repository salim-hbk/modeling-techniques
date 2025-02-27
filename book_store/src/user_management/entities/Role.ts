import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Users } from "./Users";


@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ['user', 'author'], default: "user"})
    name: "user" | "author";
}
