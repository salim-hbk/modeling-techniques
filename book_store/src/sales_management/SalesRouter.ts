import { Request, Response, Router } from "express";
import { AppDataSource } from "../config/data-source";
import { validate, ValidationError } from "class-validator";
import { ResponseMessage } from "../shared/ResponseMessage";
import { plainToInstance } from "class-transformer";
import { Double, In } from "typeorm";
import { CartDto } from "./dto/CartDto";
import { Users } from "../user_management/entities/Users";
import { Book } from "../inventory_management/entities/Book";
import { Cart } from "./entities/Cart";
import { Purchase } from "./entities/Purchase";
import { PurchaseBook } from "./entities/PurchaseBook";
import { CartBook } from "../inventory_management/entities/CartBook ";


export class SalesRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get("/cart", async (req: Request, res: Response) => {
            const list = await AppDataSource.getRepository(Cart)
                .find({
                    relations: {
                        cartBooks: {
                            book: true
                        },
                        user: true
                    }
                })
            res.json(list)
        })

        this.router.post("/cart", async (req: Request, res: Response) => {
            let result: ResponseMessage;
            let errs: ValidationError[];
            const cartDto = plainToInstance(CartDto, req.body)
            errs = await validate(cartDto)

            try {
                if (errs.length > 0)
                    throw new Error("Validation error");

                const user = await AppDataSource.getRepository(Users).findOne({ where: { id: cartDto.userId } })
                const books = await AppDataSource.getRepository(Book)
                    .find({ where: { id: In(cartDto.booksAndQty.map(it => it.id)) } })


                const cart = new Cart()
                cart.user = user;
                cart.cartBooks = [];
                const bookList: { id: number, inStock: number }[] = [];
                cart.cartBooks.push(...books.map(it => {

                    const bookAndQty = cartDto.booksAndQty.find(item => item.id == it.id)
                    if (it.inStock < bookAndQty.quantity) {
                        throw new Error("Book: '" + it.title + "' is not containing requested stock(current stock): " + it.inStock);
                    }
                    const cartBook = new CartBook();
                    cartBook.book = it;
                    cartBook.quantity = bookAndQty.quantity;

                    const newBook = { id: it.id, inStock: it.inStock - bookAndQty.quantity };


                    bookList.push(newBook)
                    return cartBook;
                }))

                const cartEnt = await AppDataSource.getRepository(Cart).save(cart);
                const bookEntList = await AppDataSource.getRepository(Book).find({ where: { id: In(bookList.map(it => it.id)) } });
                bookEntList.forEach(it => {
                    const bookItem = bookList.find(a => a.id == it.id)
                    it.inStock = bookItem.inStock
                })

                await AppDataSource.getRepository(Book).save(bookEntList)
                result = new ResponseMessage(cartEnt, 201, [])


            } catch (err) {

                if (errs.length > 0)
                    result = new ResponseMessage({}, 500, errs)
                else
                    result = new ResponseMessage({}, 500, [{ message: err.message }])
            }

            res.json(result);


        });


        this.router.post("/cart-explicit-lock", async (req: Request, res: Response) => {
            let result: ResponseMessage;
            let errs: ValidationError[];
            const cartDto = plainToInstance(CartDto, req.body)
            errs = await validate(cartDto)
   
            try {
                if (errs.length > 0)
                    throw new Error("Validation error");


                const user = await AppDataSource.getRepository(Users).findOne({ where: { id: cartDto.userId } })
                const books = await AppDataSource.getRepository(Book)
                    .find({ where: { id: In(cartDto.booksAndQty.map(it => it.id)) } })


                const cart = new Cart()
                cart.user = user;
                cart.cartBooks = [];
                const bookList: { id: number, inStock: number }[] = [];
                cart.cartBooks.push(...books.map(it => {

                    const bookAndQty = cartDto.booksAndQty.find(item => item.id == it.id)
                    if (it.inStock < bookAndQty.quantity) {
                        throw new Error("Book: '" + it.title + "' is not containing requested stock(current stock): " + it.inStock);
                    }
                    const cartBook = new CartBook();
                    cartBook.book = it;
                    cartBook.quantity = bookAndQty.quantity;

                    const newBook = { id: it.id, inStock: it.inStock - bookAndQty.quantity };


                    bookList.push(newBook)
                    return cartBook;
                }))

                const cartEnt = await AppDataSource.getRepository(Cart).save(cart);
                const bookEntList = await AppDataSource.getRepository(Book).find({ where: { id: In(bookList.map(it => it.id)) } });
                bookEntList.forEach(it => {
                    const bookItem = bookList.find(a => a.id == it.id)
                    it.inStock = bookItem.inStock
                })

                await AppDataSource.getRepository(Book).save(bookEntList)
                result = new ResponseMessage(cartEnt, 201, [])


            } catch (err) {

                if (errs.length > 0)
                    result = new ResponseMessage({}, 500, errs)
                else
                    result = new ResponseMessage({}, 500, [{ message: err.message }])
            }

            res.json(result);


        });



        this.router.delete("/cart/:id", async (req: Request, res: Response) => {
            let result: ResponseMessage;
            let errs: ValidationError[];
            const cartId: number = parseInt(req.params.id);

            try {
                const cartItem = await AppDataSource.getRepository(Cart).findOne({ where: { id: cartId }, relations: { cartBooks: true } })
                if (!cartItem)
                    throw new Error("No items in cart");
                await AppDataSource.getRepository(Cart).delete(cartId)

                result = new ResponseMessage({ message: "Deleted successfully" }, 200, [])

            } catch (err) {

                if (errs)
                    result = new ResponseMessage({}, 500, errs)
                else
                    result = new ResponseMessage({}, 500, [err])
            }

            res.json(result);


        });


        this.router.post("/purchase/:id", async (req: Request, res: Response) => {
            let result: ResponseMessage;
            console.log("", req.params.id)

            const cartIEntity = await AppDataSource
                .getRepository(Cart)
                .findOne({
                    where: { id: parseInt(req.params.id) },
                    relations: { cartBooks: { book: true }, user: true }
                })


            try {
                if (!cartIEntity)
                    throw new Error("No Cart item");

                const purchaseObj = new Purchase();
                purchaseObj.status = "Paid"
                purchaseObj.user = cartIEntity.user;


                purchaseObj.totalAmount = cartIEntity
                    .cartBooks.filter(it => it.book)
                    .map(it => parseFloat("" + it.book.price)).reduce((total, cost) => total + cost, 0)



                console.log("purchaseObj.totalAmount: ", purchaseObj.totalAmount)
                purchaseObj.orderItems = [];

                purchaseObj.orderItems.push(...cartIEntity.cartBooks.map(it => {
                    const order = new PurchaseBook();
                    order.book = it.book;
                    order.price = it.quantity * it.book.price;
                    order.quantity = it.quantity;
                    return order
                }))



                const purchaseEnt = await AppDataSource.getRepository(Purchase).save(purchaseObj);
                console.log("Purchase successfully")
                //await AppDataSource.getRepository(Purchase).delete(purchaseEnt.id)
                await AppDataSource.getRepository(Cart).delete(parseInt(req.params.id))
                result = new ResponseMessage(purchaseEnt, 201, [])


            } catch (err) {
                console.log("", err)

                result = new ResponseMessage({}, 500, [err])
            }

            res.json(result);


        });


        this.router.post("/purchase/raw-query-builder/:id", async (req: Request, res: Response) => {
            let result: ResponseMessage;
            console.log("", req.params.id)
            const cartId = parseInt(req.params.id);

            const rawData = await AppDataSource.query(`
                SELECT cart.id AS cart_id, cart.userId AS cart_userId, cartBooks.id AS cartBooks_id, cartBooks.quantity AS 
                cartBooks_quantity, cartBooks.bookId AS cartBooks_bookId, cartBooks.cartId 
AS cartBooks_cartId, book.id AS book_id, book.title AS book_title, book.description AS book_description, book.price AS
 book_price, book.author_id AS book_author_id, user.id AS user_id, user.username AS user_username, user.email AS
 user_email, user.createdAt AS user_createdAt, user.roleId AS user_roleId FROM cart  INNER JOIN cart_book cartBooks ON cartBooks.cartId=cart.id  
INNER JOIN book book ON book.id=cartBooks.bookId  INNER JOIN users user ON user.id=cart.userId WHERE cart.id = ?`, [cartId])


            const cartIEntity = plainToInstance(Cart, {
                ...rawData[0], // Assume rawData contains one cart (adjust if multiple rows for relations)
                user: plainToInstance(Users, rawData[0]), // Map user
                cartBooks: rawData.map((row) =>
                    plainToInstance(CartBook, {
                        ...row,
                        book: plainToInstance(Book, row), // Map books for each cartBook
                    })
                ),
            });



            try {

                result = new ResponseMessage(cartIEntity, 201, [])


            } catch (err) {
                console.log("", err)

                result = new ResponseMessage({}, 500, [err])
            }

            res.json(result);


        });


        this.router.post("/purchase/query-builder/:id", async (req: Request, res: Response) => {
            let result: ResponseMessage;
            console.log("", req.params.id)



            const cartIEntity = await AppDataSource.getRepository(Cart)
                .createQueryBuilder("cart")
                .innerJoinAndSelect('cart.cartBooks', 'cartBooks')
                .innerJoinAndSelect('cartBooks.book', 'book')
                .innerJoinAndSelect('cart.user', 'user')
                .where('cart.id = :id', { id: parseInt(req.params.id) }).getOne();


            try {
                if (!cartIEntity)
                    throw new Error("No Cart item");
                const purchaseObj = new Purchase();
                purchaseObj.status = "Paid"
                purchaseObj.user = cartIEntity.user;
                purchaseObj.totalAmount = cartIEntity
                    .cartBooks.map(it => it.book.price)
                    .reduce((total, price) => total + price, 0)
                purchaseObj.orderItems = [];
                purchaseObj.orderItems.push(...cartIEntity.cartBooks.map(it => {
                    const order = new PurchaseBook();
                    order.book = it.book;
                    order.price = it.quantity * it.book.price;
                    order.quantity = it.quantity;
                    return order
                }))



                const purchaseEnt = await AppDataSource.getRepository(Purchase).save(purchaseObj);
                await AppDataSource.getRepository(Cart).delete(parseInt(req.params.id))
                result = new ResponseMessage(purchaseEnt, 201, [])


            } catch (err) {
                console.log("", err)

                result = new ResponseMessage({}, 500, [err])
            }

            res.json(result);


        });


    }
}