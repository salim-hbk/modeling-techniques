import { ChildEntity, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Profile } from "./Profile";
import { Users } from "./Users";

@ChildEntity()
export class AuthorProfile extends Profile{

    @Column()
    biography: string;

    @OneToOne(()=>Users, {onDelete: "CASCADE"})
    @JoinColumn()
    user: Users


}