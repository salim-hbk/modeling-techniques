import { AppDataSource } from "./config/data-source"
import * as express from "express";
import { Request, Response } from "express";
import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { HierarchicalRouter } from "./hierarchical/HierarchicalRouter";
import { AssociationRouter } from "./association/AssociationRouter";
import { VersioningRouter } from "./versioning/VersioningRouter";
import { MultiTenant } from "./multi_tenant/MultiTenant";


const app = express();
app.use(express.json());

app.use("/hierarchical", new HierarchicalRouter().router)
app.use("/association", new AssociationRouter().router)
app.use("/versioning", new VersioningRouter().router)
app.use("/multi-tenant", new MultiTenant().router)

app.listen(3001, () => {

    console.log("App running on http://localhost:3001/")
});

AppDataSource.initialize().then(async () => {
    console.log("DB is initialized")
}).catch(error => console.log("Error while initializing DB", error));