<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
=======
import { Entity, PrimaryGeneratedColumn, Column, VersionColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
>>>>>>> 974f0a5 (Study materials on RDBMS Design patterns for future self reference)
import { DataSource } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  balance: number;
<<<<<<< HEAD
=======


  @VersionColumn()
  version: number

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
>>>>>>> 974f0a5 (Study materials on RDBMS Design patterns for future self reference)
}