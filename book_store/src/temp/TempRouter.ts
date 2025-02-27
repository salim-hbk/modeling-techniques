import { Request, Response, Router } from "express";
import { AppDataSource } from "../config/data-source";
<<<<<<< HEAD
import { validate, ValidationError } from "class-validator";
import { ResponseMessage } from "../shared/ResponseMessage";
import { plainToInstance } from "class-transformer";
import { In } from "typeorm";
=======
>>>>>>> 974f0a5 (Study materials on RDBMS Design patterns for future self reference)
import { Customer } from "./entities/Customer";
import { Booking } from "./entities/Booking";
import { Account } from "./entities/Account";



export class TempRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.initializeRoutes();
    }
    private initializeRoutes() {

        this.router.get("/customer-bookings", async (req: Request, res: Response) => {
            res.status(200).json(await allCustomerBookings());
        })
        this.router.get("/customer-bookings-by-email/:email", async (req: Request, res: Response) => {
            res.status(200).json(await customerByEmail(req.params.email));
        })
        this.router.get("/projection", async (req: Request, res: Response) => {
            res.status(200).json(await customerByProjection());
        })
        this.router.get("/delete/:id", async (req: Request, res: Response) => {
            res.status(200).json(await deleteById(req.params.id));
        })

        this.router.get("/update-user/:id", async (req: Request, res: Response) => {
            res.status(200).json(await updateUser(req.params.id));
        })
        this.router.get("/bookins-by-customer", async (req: Request, res: Response) => {
            res.status(200).json(await getAllBookings());
        })


        this.router.get("/transaction-locks/:fromId/:toId/:amount", async (req: Request, res: Response) => {
            const fromId = parseInt(req.params.fromId);
            const toId = parseInt(req.params.toId);
            const amount = parseInt(req.params.amount);
            res.status(200).json(await transactionExample(fromId, toId, amount));
        })

        this.router.get("/transaction-no-locks/:fromId/:toId/:amount", async (req: Request, res: Response) => {
            const fromId = parseInt(req.params.fromId);
            const toId = parseInt(req.params.toId);
            const amount = parseInt(req.params.amount);
            res.status(200).json(await transactionExampleNoLocks(fromId, toId, amount));
        })

<<<<<<< HEAD

    }
}
async function transactionExampleNoLocks(fromAccountId: number,
=======
        this.router.get("/transaction-optimist-locks/:fromId/:toId/:amount", async (req: Request, res: Response) => {
            const fromId = parseInt(req.params.fromId);
            const toId = parseInt(req.params.toId);
            const amount = parseInt(req.params.amount);
            res.status(200).json(await transactionExampleOptimistLocks(fromId, toId, amount));
        })


    }
}

//Optimisric Lock
async function transactionExampleOptimistLocks(fromAccountId: number,
>>>>>>> 974f0a5 (Study materials on RDBMS Design patterns for future self reference)
    toAccountId: number,
    amount: number) {

    const response = { message: '' }
<<<<<<< HEAD

    try {

        const accountRepository = AppDataSource.getRepository(Account)
=======
    const accountRepository = AppDataSource.getRepository(Account)

    try {


>>>>>>> 974f0a5 (Study materials on RDBMS Design patterns for future self reference)
        const fromAccount = await accountRepository.findOneByOrFail({
            id: fromAccountId,
        });
        const toAccount = await accountRepository.findOneByOrFail({
            id: toAccountId,
        });

        if (fromAccount.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // Simulate delay to allow concurrent requests
        await new Promise((resolve) => setTimeout(resolve, 5000));

<<<<<<< HEAD
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await this.accountRepository.save(fromAccount);
        await this.accountRepository.save(toAccount);
=======
        let fromBal = parseFloat("" + fromAccount.balance)
        let toBal = parseFloat("" + toAccount.balance)

        fromBal -= amount
        toBal += amount

        fromAccount.balance = fromBal;
        toAccount.balance = toBal;

        const fromAccountNew = await accountRepository.findOneByOrFail({
            id: fromAccountId,
        });
        const toAccountNew = await accountRepository.findOneByOrFail({
            id: toAccountId,
        });

        if (fromAccountNew.version === fromAccount.version && toAccountNew.version === toAccount.version) {
            fromAccount.version = parseInt("" + fromAccount.version) + 1
            toAccount.version = parseInt("" + toAccount.version) + 1
            const result1 = await accountRepository.save(fromAccount);
            const result2 = await accountRepository.save(toAccount);
        }else{
            throw new Error("Transaction Failed. due to stale data.");
        }




>>>>>>> 974f0a5 (Study materials on RDBMS Design patterns for future self reference)
        response.message = "Transaction successfull"
    } catch (err) {
        response.message = "Transaction failure: " + err.message
    }

<<<<<<< HEAD

    return response;
}
=======
    return response;
}


async function transactionExampleNoLocks(fromAccountId: number,
    toAccountId: number,
    amount: number) {

    const response = { message: '' }
    const accountRepository = AppDataSource.getRepository(Account)

    try {


        const fromAccount = await accountRepository.findOneByOrFail({
            id: fromAccountId,
        });
        const toAccount = await accountRepository.findOneByOrFail({
            id: toAccountId,
        });

        if (fromAccount.balance < amount) {
            throw new Error('Insufficient funds');
        }

        // Simulate delay to allow concurrent requests
        await new Promise((resolve) => setTimeout(resolve, 5000));

        let fromBal = parseFloat("" + fromAccount.balance)
        let toBal = parseFloat("" + toAccount.balance)

        fromBal -= amount
        toBal += amount

        fromAccount.balance = fromBal;
        toAccount.balance = toBal;

        // const fromAccountNew = await accountRepository.findOneByOrFail({
        //     id: fromAccountId,
        // });
        // const toAccountNew = await accountRepository.findOneByOrFail({
        //     id: toAccountId,
        // });

        const result1 = await accountRepository.save(fromAccount);
        const result2 = await accountRepository.save(toAccount);


        response.message = "Transaction successfull"
    } catch (err) {
        response.message = "Transaction failure: " + err.message
    }

    return response;
}


>>>>>>> 974f0a5 (Study materials on RDBMS Design patterns for future self reference)
async function allCustomerBookings(): Promise<any> {
    const customers = await AppDataSource
        .getRepository(Customer)
        .createQueryBuilder("customer")
        .leftJoinAndSelect("customer.bookings", "booking")
        .getMany();

    return customers;
}
async function customerByEmail(email: string): Promise<any> {
    return await AppDataSource
        .getRepository(Customer)
        .createQueryBuilder("customer")
        .leftJoinAndSelect("customer.bookings", "booking")
        .where("customer.email = :email", { email: email })
        .getOne();
}

async function customerByProjection(): Promise<any> {
    return await AppDataSource
        .getRepository(Customer)
        .createQueryBuilder("customer")
        .leftJoinAndSelect("customer.bookings", "booking")
        .select(["customer.name", "booking.checkInDate", "booking.checkOutDate"])
        .getMany();
}

async function deleteById(id: string): Promise<any> {
    return await AppDataSource
        .getRepository(Booking)
        .createQueryBuilder("booking")
        .delete()
        .where("id = :id", { id })
        .execute();
}

async function getAllBookings(): Promise<any> {
    return await AppDataSource
        .getRepository(Customer)
        .createQueryBuilder("customer")
        .select("customer.id", "customerId")
        .addSelect("customer.name", "customerName")
        .addSelect("COUNT(booking.id)", "bookingCount")
        .leftJoin("customer.bookings", "booking")
        .groupBy("customer.id")
        .addGroupBy("customer.name")
        .getRawMany();
}

async function updateUser(id: string): Promise<any> {

    return await AppDataSource
        .getRepository(Customer)
        .createQueryBuilder("customer")
        .update()
        .set({ name: "Akash", email: "akash@gmail.com" })
        .where("id = :id", { id })
        .execute();
}

async function transactionExample(fromAccountId: number,
    toAccountId: number,
    amount: number): Promise<any> {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const response = { message: "" }

    try {
        // Lock the accounts to prevent concurrent updates
        const fromAccount = await queryRunner.manager.findOne(Account, {
            where: { id: fromAccountId },
            lock: { mode: 'pessimistic_write' }, // Lock for writing
        });

        const toAccount = await queryRunner.manager.findOne(Account, {
            where: { id: toAccountId },
            lock: { mode: 'pessimistic_write' }, // Lock for writing
        });

        if (!fromAccount || !toAccount) {
            throw new Error('Account not found');
        }

        if (fromAccount.balance < amount) {
            throw new Error('Insufficient funds');
        }

<<<<<<< HEAD
        // Update balances
        fromAccount.balance -= amount;
        toAccount.balance += amount;
=======
        await new Promise((resolve) => setTimeout(resolve, 5000))

        let fromBal = parseFloat("" + fromAccount.balance)
        let toBal = parseFloat("" + toAccount.balance)

        fromBal -= amount
        toBal += amount

        fromAccount.balance = fromBal;
        toAccount.balance = toBal;
>>>>>>> 974f0a5 (Study materials on RDBMS Design patterns for future self reference)

        await queryRunner.manager.save(fromAccount);
        await queryRunner.manager.save(toAccount);

        await queryRunner.commitTransaction();
        console.log('Funds transferred successfully');
        response.message = "Funds transferred successfully"
    } catch (error) {
        console.error('Error during fund transfer:', error.message);
        response.message = "Error during fund transfer: " + error.message
        await queryRunner.rollbackTransaction();
    } finally {
        await queryRunner.release();
    }
    return response;

}

