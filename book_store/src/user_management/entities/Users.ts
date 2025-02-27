import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StringTransformer } from "../../shared/StringTransformer";
import { Role } from "./Role";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsNotEmpty({ message: "Username should not be empty" })
    @IsString({ message: "Username should not be text" })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
    })
    username: string;

    @Column({ unique: true })
    @IsNotEmpty({ message: "Email should not be empty" })
    @IsEmail({}, { message: "Must be a valid email" })
    email: string;

    @Column({select:false, transformer: new StringTransformer()})
    @IsNotEmpty({ message: "Password is required" })
    @MinLength(5, { message: "Password must be at least 5 characters long" })
    @Matches(/^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/, {
        message:
            "Password must contain at least one special character and be alphanumeric",
    })
    password: string

    @ManyToOne(()=> Role, {cascade: true, onDelete: "CASCADE"})
    role: Role;

  

    @CreateDateColumn()
    createdAt: string;

}