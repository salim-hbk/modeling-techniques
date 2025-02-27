import { Request, Response, Router } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "./entities/User";
import { Profile } from "./entities/Profile";
import { News } from "./entities/News";
import { Author } from "./entities/Author";
import { Book } from "./entities/Book";




export class AssociationRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.initializeRoutes();
    }
    private initializeRoutes() {

        this.router.get("/save-use-profile", async (req: Request, res: Response) => {
            const userRepo = AppDataSource.getRepository(User);

            const profile = new Profile();
            profile.age = 30;
            profile.bio = "I am a developer";

            const user = new User();
            user.name = "John Doe";
            user.email = "john@email.com";
            user.profile = profile;
            userRepo.save(user);

            const profile1 = new Profile();
            profile1.age = 25;
            profile1.bio = "Graphic Designer from CA";

            const user1 = new User();
            user1.name = "Jane Smith";
            user1.email = "jane.smith@example.com";
            user1.profile = profile1;
            userRepo.save(user1);

            const profile2 = new Profile();
            profile2.age = 28;
            profile2.bio = "Data Scientist from TX";

            const user2 = new User();
            user2.name = "Alice Johnson";
            user2.email = "alice.johnson@example.com";
            user2.profile = profile2;
            userRepo.save(user2);

            const profile3 = new Profile();
            profile3.age = 35;
            profile3.bio = "Project Manager from FL";

            const user3 = new User();
            user3.name = "Bob Brown";
            user3.email = "bob.brown@example.com";
            user3.profile = profile3;
            userRepo.save(user3);


            res.json("Data initialized");

        })
        this.router.get("/delete-use-profile", async (req: Request, res: Response) => {
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { id: 3 }, relations: ["profile"] });
            await userRepo.remove(user);
            res.json("User deleted");
        })


        this.router.get("/save-news", async (req: Request, res: Response) => {
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOne({ where: { id: 4 } });
            const news1 = new News();
            news1.title = "Tech Conference 2025";
            news1.content = "Join us for the annual tech conference where industry leaders discuss the latest trends in technology.";
            const news2 = new News();
            news2.title = "New Graphic Design Tools Released";
            news2.content = "A new suite of graphic design tools has been released, offering innovative features for designers.";
            user.news = [news1, news2];

            await userRepo.save(user);
            res.json("User saved");
        })

        this.router.get("/save-author-column", async (req: Request, res: Response) => {
            const bookRepo = AppDataSource.getRepository(Book);
            const author1 = new Author();
            author1.name = "George Orwell";

            const author2 = new Author();
            author2.name = "J.K. Rowling";

            const author3 = new Author();
            author3.name = "Harper Lee";

            const book1 = new Book();
            book1.title = "1984";
            book1.authors = [author1, author2, author3];
            bookRepo.save(book1);


            res.json("Saved successfully.");
        })
        this.router.get("/delete-book", async (req: Request, res: Response) => {
            const bookRepo = AppDataSource.getRepository(Book);
            const book = await bookRepo.findOne({ where: { id: 1 }, relations: ["authors"] });
            await bookRepo.remove(book);

            res.json("Book deleted");
        })



    }
}




