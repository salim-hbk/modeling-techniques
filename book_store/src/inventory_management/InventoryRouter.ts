import { Request, Response, Router } from "express";
import { AppDataSource } from "../config/data-source";
import { validate, ValidationError } from "class-validator";
import { ResponseMessage } from "../shared/ResponseMessage";
import { plainToInstance } from "class-transformer";
import { Book } from "./entities/Book";
import { BookDto } from "./dto/BookDto";
import { Users } from "../user_management/entities/Users";
import { Category } from "./entities/Category";
import { In } from "typeorm";
import { time } from "console";


export class InventoryRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get("/", async (req: Request, res: Response) => {

            const catalogs = await AppDataSource.getRepository(Book)
                .find({
                    relations: {author:true, categories: true}
                })
            res.json(catalogs)
        })

        this.router.post("/", async (req: Request, res: Response) => {
            let result: ResponseMessage;
            let errs: ValidationError[];
            try {
                const bookDto: BookDto = plainToInstance(BookDto, req.body);

                const validationErr = await validate(bookDto)
                if (validationErr.length > 0) {
                    errs = validationErr;
                    throw new Error(JSON.stringify(validationErr))
                }

                const author = await AppDataSource.getRepository(Users).findOneBy({ id: bookDto.authorId });
                const categories = await AppDataSource.getRepository(Category)
                    .findBy({ id: In(bookDto.categoryId) })

                const book = new Book();
                book.author = author;
                book.title = bookDto.title;
                book.description = bookDto.description;
                book.price = bookDto.price;
                book.categories = categories;

                const bookEnt = await AppDataSource.manager.save(Book, book)
                result = new ResponseMessage(bookEnt, 201, [])

            } catch (err) {
                if (errs)
                    result = new ResponseMessage({}, 500, errs)
                else
                    result = new ResponseMessage({}, 500, err)

            }
            res.json(result)



        });

        this.router.put("/", async (req: Request, res: Response) => {


        });


    }
}