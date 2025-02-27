import { IsNotEmptyObject, IsNumber, Min, MinLength } from "class-validator";

export class CartDto {



    @IsNumber()
    @Min(1)
    userId: number;


    booksAndQty: [{ id: 0, quantity: 0 }];
}