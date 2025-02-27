import { AppDataSource } from "./config/data-source"
import * as express from "express";
import { Request, Response } from "express";
import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { UserRouter } from "./user_management/UserRouter";
import { AuthorRouter } from "./user_management/AuthorRouter";
import { InventoryRouter } from "./inventory_management/InventoryRouter";
import { SalesRouter } from "./sales_management/SalesRouter";
import { TempRouter } from "./temp/TempRouter";

const app = express();
app.use(express.json());

app.use("/user", new UserRouter().router)
app.use("/author", new AuthorRouter().router)
app.use("/book", new InventoryRouter().router)
app.use("/sales", new SalesRouter().router)
app.use("/temp", new TempRouter().router)

app.listen(3001, () => {

    console.log("App running on http://localhost:3001/")
});

AppDataSource.initialize().then(async () => {
    console.log("DB is initialized")
}).catch(error => console.log("Error while initializing DB", error));