import {  Min, MinLength } from "class-validator";

export class UserUpdateDto{

    @MinLength(1)
    @Min(1)
    id: number;
    email:string;
    password: string;
}