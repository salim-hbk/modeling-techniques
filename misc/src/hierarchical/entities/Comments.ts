import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Comments, (post) => post.children)
  parent: Comments;

  @OneToMany(() => Comments, (user) => user.parent)
  children: Comments[];
  
}