import { PrimaryGeneratedColumn, Column, ViewColumn, ViewEntity, DataSource } from "typeorm";

@ViewEntity({
    expression: (dataSource: DataSource) => 
        dataSource.createQueryBuilder()
    .select("news.title", "newsTitle")
    .addSelect("news.content", "newsContent")
    .addSelect("user.name", "userName")
    .from("news", "news")
    .innerJoin("user", "user", "user.id = news.userId")
})
export class NewsView {
    
    @ViewColumn()
    newsTitle: string;
    @ViewColumn()
    newsContent: string;
    @ViewColumn()
    userName: string;
}