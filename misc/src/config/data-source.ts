import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "misc",
    synchronize: true,
    logging: true,
    entities: [__dirname + "/../**/entities/*.ts"], // Adjust to match your folder structure
    migrations: [__dirname + "/../migrations/*.ts"],
    subscribers: [],
})
