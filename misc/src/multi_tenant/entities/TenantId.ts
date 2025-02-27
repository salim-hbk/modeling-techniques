import { Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


export class TenantId {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

  
}