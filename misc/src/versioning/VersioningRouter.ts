import { Request, Response, Router } from "express";
import { AppDataSource } from "../config/data-source";
import { SalaryTable } from "./entities/SalaryTable";
import { Account } from "./entities/Account";
import { Cart } from "./entities/Cart";




export class VersioningRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.initializeRoutes();
    }
    private initializeRoutes() {

        this.router.get("/temporal-save", async (req: Request, res: Response) => {
            const repoSalary = AppDataSource.getRepository(SalaryTable)
            const salary = new SalaryTable();
            salary.name = "John Doe";
            salary.department = "HR";
            salary.salary = 5000;
            salary.validFrom = new Date();
            salary.validTo = null;
            repoSalary.save(salary);


            res.json("Data saved");

        })
        this.router.get("/temporal-update", async (req: Request, res: Response) => {
            const repoSalary = AppDataSource.getRepository(SalaryTable)
            const oldSalary = await repoSalary.findOne({ where: { id: 1 } })
            oldSalary.validTo = new Date();
            await repoSalary.save(oldSalary);

            const newSalary = new SalaryTable();
            newSalary.name = oldSalary.name;
            newSalary.department = oldSalary.department;
            newSalary.salary = 6000;
            newSalary.validFrom = new Date();
            newSalary.validTo = null;
            newSalary.department = oldSalary.department;
            await repoSalary.save(newSalary);

            res.json("Salary updated...");
        })

        this.router.get("/temporal-get", async (req: Request, res: Response) => {
            const repoSalary = AppDataSource.getRepository(SalaryTable)
            const latestSalary = await repoSalary.createQueryBuilder("salary")
                .where("salary.validTo IS NULL")
                .getOne();


            res.json(latestSalary);
        })

        this.router.get("/event-save", async (req: Request, res: Response) => {
            const accRepo = AppDataSource.getRepository(Account);
            const accounts = [
                { accountId: 1, eventType: 'DEPOSIT', amount: 1000, eventTime: new Date() },
                { accountId: 1, eventType: 'WITHDRAWAL', amount: 500, eventTime: new Date() },
                { accountId: 1, eventType: 'DEPOSIT', amount: 2000, eventTime: new Date() }
            ];

            for (const accData of accounts) {
                const account = new Account();
                account.accountId = accData.accountId;
                account.eventType = accData.eventType;
                account.amount = accData.amount;
                account.eventTime = accData.eventTime;
                await accRepo.save(account);
            }

            res.json("Data saved");

        });

        this.router.get("/event-get", async (req: Request, res: Response) => {
            const accRepo = AppDataSource.getRepository(Account);
            const balance = await accRepo.query(`SELECT SUM(CASE 
             WHEN eventType = 'DEPOSIT' THEN amount 
             WHEN eventType = 'WITHDRAWAL' THEN -amount 
           END) AS balance
            FROM account WHERE accountId = 1;`);

            res.json(balance[0]);

        });


        this.router.get("/create-cart", async (req: Request, res: Response) => {
            const cartRepo = AppDataSource.getRepository(Cart);
            const carts = [
                { cartItem: 'Item1', isDeleted: false, createdOn: new Date() },
                { cartItem: 'Item3', isDeleted: false, createdOn: new Date() },
                { cartItem: 'Item5', isDeleted: false, createdOn: new Date() }
            ];

            for (const cartData of carts) {
                const cart = new Cart();
                cart.cartItem = cartData.cartItem;
                cart.isDeleted = cartData.isDeleted;
                cart.createdOn = cartData.createdOn;
                await cartRepo.save(cart);
            }
            res.json("Carts created");

        });

        this.router.get("/delete-cart-item", async (req: Request, res: Response) => {
            const cartRepo = AppDataSource.getRepository(Cart);
            const cartItem = await cartRepo.findOne({ where: { id: 1 } })
            if (!cartItem) {
                throw new Error("Cart item not found");
            }
            cartItem.isDeleted = true;
            cartRepo.save(cartItem);

            res.json("Cart item deleted");

        });

        this.router.get("/fetch-cart-item", async (req: Request, res: Response) => {
            const cartRepo = AppDataSource.getRepository(Cart);
            const cartItem = await cartRepo.find({ where: { isDeleted: false } })
            if (!cartItem) {
                throw new Error("Cart item not found");
            }


            res.json(cartItem);

        });

        this.router.get("/fetch-news", async (req: Request, res: Response) => {
            const newsRepo = AppDataSource.getRepository(NewsView);
            const newsItems = await newsRepo.find();

            res.json(newsItems);

        });


    }
}




