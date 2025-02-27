import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class BookDto{
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    description: string;
    @IsNumber()
    @Min(0.0)
    price: number;
    @IsNumber()
    authorId: number;
    @IsNumber({}, {each: true})
    categoryId: number[];
}