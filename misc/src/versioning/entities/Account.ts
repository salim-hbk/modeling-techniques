import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Account{
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accountId: number;

    @Column({type: "enum", enum: ["DEPOSIT", "WITHDRAWAL"]})
    eventType: string;

    @Column()
    amount: number;

    @Column()
    eventTime: Date;

}