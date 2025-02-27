import { Request, Response, Router } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "./entities/Product";
import { TenantId } from "./entities/TenantId";
import { faker } from "@faker-js/faker";




export class MultiTenant {
    public router: Router;

    constructor() {
        this.router = Router()
        this.initializeRoutes();
    }
    private initializeRoutes() {
        const productRepository = AppDataSource.getRepository(Product);

        this.router.get("/create", async (req: Request, res: Response) => {
            const tenants = ["tenant1", "tenant2", "tenant3", "tenant4", "tenant5"];
            tenants.forEach(it=>{
                const product = new Product();
                const tenant=new TenantId();   
                tenant.name=it;           
                product.tenant = tenant;
                product.name = faker.commerce.productName();
                product.description = faker.commerce.productDescription();
                product.price = faker.commerce.price();
                productRepository.save(product);

            })
          

            res.json("Data initialized");

        })
        this.router.get("/list", async (req: Request, res: Response) => {
            const productRepository = AppDataSource.getRepository(Product);
            const items = await productRepository.find();
            res.json(items);

        })
       






    }
}




