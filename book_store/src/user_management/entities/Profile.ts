import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export  class Profile{

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    age: number;
    @Column()
    address: string;
    @Column({type: 'enum', enum: ['male', 'female']})
    gender: "male"|"female"
}


