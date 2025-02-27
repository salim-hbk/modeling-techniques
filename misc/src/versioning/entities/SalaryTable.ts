import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SalaryTable {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    department: string;
    @Column()
    salary: number;
    @Column()
    validFrom: Date;
    @Column({nullable: true})
    validTo: Date;
}