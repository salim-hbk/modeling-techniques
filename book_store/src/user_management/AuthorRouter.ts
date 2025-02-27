import { Request, Response, Router } from "express";
import { AppDataSource } from "../config/data-source";
import { validate } from "class-validator";
import { ResponseMessage } from "../shared/ResponseMessage";
import { Users } from "./entities/Users";
import { plainToInstance } from "class-transformer";
import { Role } from "./entities/Role";
import { CustomerProfile } from "./entities/CustomerProfile";
import { AuthorProfile } from "./entities/AuthorProfile";
import { STATUS_CODES } from "http";

export class AuthorRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get("/", (req: Request, res: Response) => {
            res.status(404).json();
        })

        this.router.post("/", async (req: Request, res: Response) => {

            const user = plainToInstance(Users, req.body.user_info);
            const profile = plainToInstance(AuthorProfile, req.body.profile);

            const errors = await validate(user);
            if (errors.length > 0) {
                res.status(500).json(new ResponseMessage({}, 500, errors))
                return;
            }

            try {
                const role = new Role()
                role.name = "author";
                const roleEntity = await AppDataSource.manager.save(role);
                user.role = roleEntity;
                const userEntity = await AppDataSource.manager.save(user);
                userEntity.password = "";
                profile.user = userEntity;
                await AppDataSource.manager.save(profile)
                res.status(201).json(new ResponseMessage(userEntity, 200, []))

            } catch (err) {
                //res.json({ message: "success" });
                console.log(err)
                res.status(500).json(new ResponseMessage({}, 500, [err]))
            }


        });

        this.router.put("/", async (req: Request, res: Response) => {

            const user = plainToInstance(Users, req.body.user_info);

            try {
                const userInDB = await AppDataSource.manager.findOne(Users, { where: { id: user.id } })
                if (!userInDB) {
                    res.status(404).json(new ResponseMessage({}, 500, [{ message: "No user found" }]))
                    return;
                }
                const updatedUser = AppDataSource.getRepository(Users).merge(userInDB, user)
                await AppDataSource.manager.save(updatedUser)
                console.log("updatedUser: ", updatedUser);
                res.status(200).json(updatedUser)

            } catch (err) {
                //res.json({ message: "success" });
                console.log(err)
                res.status(500).json(new ResponseMessage({}, 500, [err]))
            }


        });


    }
}