import { Request, Response, Router } from "express";
import { AppDataSource } from "../config/data-source";
import { Comments } from "./entities/Comments";
import { Item } from "./entities/Item";




export class HierarchicalRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.initializeRoutes();
    }
    private initializeRoutes() {

        this.router.get("/init-adjacency", async (req: Request, res: Response) => {
            const comment1 = new Comments();
            comment1.text = "comment1";
            comment1.parent = null;
            await AppDataSource.getRepository(Comments).save(comment1);

            const comment2 = new Comments();
            comment2.text = "comment2";
            comment2.parent = comment1;
            await AppDataSource.getRepository(Comments).save(comment2);

            const comment22 = new Comments();
            comment22.text = "comment22";
            comment22.parent = comment2;
            await AppDataSource.getRepository(Comments).save(comment22);

            res.json("Data initialized");

        })
        this.router.get("/adjacency", async (req: Request, res: Response) => {
            const comments = await AppDataSource.getRepository(Comments).find({ where: { parent: null }, relations: ["children"] });
            res.json(comments);

        })

        this.router.get("/init-comments", async (req: Request, res: Response) => {

            const item1 = new Item();
            item1.category = "Electronics";
            await AppDataSource.getRepository(Item).save(item1);

            const fashion = new Item();
            fashion.category = "Fashion";
            await AppDataSource.getRepository(Item).save(fashion);

            const men = new Item();
            men.category = "Men Fashion";
            men.parent = fashion;
            await AppDataSource.getRepository(Item).save(men)

            const item2 = new Item();
            item2.category = "Mobiles";
            item2.parent = item1;
            await AppDataSource.getRepository(Item).save(item2);

            const item3 = new Item();
            item3.category = "Samsung";
            item3.parent = item2;
            await AppDataSource.getRepository(Item).save(item3);

            const item4 = new Item();
            item4.category = "LG";
            item4.parent = item2;
            await AppDataSource.getRepository(Item).save(item4);

            const item5 = new Item();
            item5.category = "TV";
            item5.parent = item1;
            await AppDataSource.getRepository(Item).save(item5);

            res.json("Data initialized");

        })
        this.router.get("/comments", async (req: Request, res: Response) => {
            const items = await AppDataSource.getTreeRepository(Item).findTrees();
            res.json(items);


        })






    }
}




