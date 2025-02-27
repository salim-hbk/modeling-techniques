import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    public id: number;
    @Column()
    public cartItem: string;
    @Column()
    public isDeleted: boolean;
    @Column()
    public createdOn: Date;  
}