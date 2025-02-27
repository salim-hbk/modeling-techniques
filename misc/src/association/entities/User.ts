import { PrimaryGeneratedColumn, Column, Entity, OneToOne, OneToMany } from "typeorm";
import { Profile } from "./Profile";
import { News } from "./News";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    email: string;
    @OneToOne(() => Profile, profile => profile.user, {cascade: true})
    profile: Profile;

    @OneToMany(() => News, news => news.user, {cascade: true})
    news: News[];

}