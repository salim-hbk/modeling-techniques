import { Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("closure-table", {
    closureTableName: "item_closure",
    ancestorColumnName: (column) => "ancestor_" + column.propertyName,
    descendantColumnName: (column) => "descendant_" + column.propertyName,
})
export class   Item{

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    category: string;

    @TreeChildren()
    children: Item[]

    @TreeParent()
    parent: Item
    
}