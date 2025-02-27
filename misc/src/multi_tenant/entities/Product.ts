import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
import { TenantId } from "./TenantId";

@Entity()
export class Product {


   
    @Column(()=>TenantId)
    tenant: TenantId;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: string;


}