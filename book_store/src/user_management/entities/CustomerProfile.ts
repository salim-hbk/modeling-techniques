import { ChildEntity, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Profile } from "./Profile";
import { Users } from "./Users";

@ChildEntity()
export class CustomerProfile extends Profile {
    
    @Column()
    rewards: number;

    @OneToOne(() => Users, {onDelete: "CASCADE"})
    @JoinColumn()
    user: Users;

}