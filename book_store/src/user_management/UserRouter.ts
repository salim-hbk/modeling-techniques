import { Request, Response, Router } from "express";
import { AppDataSource } from "../config/data-source";
import { validate } from "class-validator";
import { ResponseMessage } from "../shared/ResponseMessage";
import { Users } from "./entities/Users";
import { plainToInstance } from "class-transformer";
import { Role } from "./entities/Role";
import { CustomerProfile } from "./entities/CustomerProfile";
import { error } from "console";
import { stringify } from "querystring";
import { SearchDto } from "./dto/SearchDto";
import { LoginDto } from "./dto/LoginDto";
import { StringTransformer } from "../shared/StringTransformer";
import { UserUpdateDto } from "./dto/UserUpdateDto";

export class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get("/", async (req: Request, res: Response) => {

            const userList = await AppDataSource.getRepository(Users)
                .find({
                    relations: {
                        role: true
                    }
                })
            res.json(userList);
            
        })


        this.router.post("/search", (req: Request, res: Response) => {
            const query = plainToInstance(SearchDto, req.body)


            res.json({ message: query });
        })

        this.router.post("/login", async (req: Request, res: Response) => {
            const loginDto = plainToInstance(LoginDto, req.body)
            const query = `
            SELECT * 
            FROM users 
            WHERE username = '${loginDto.username}' AND password = '${new StringTransformer().to(loginDto.password)}'
        `;
            const entity = await AppDataSource.manager
                .query(query)



            res.json(entity);
        })

        this.router.post("/login-parameterized", async (req: Request, res: Response) => {
            const loginDto = plainToInstance(LoginDto, req.body)
            const query = `
            SELECT * 
            FROM users 
            WHERE username = ? AND password = ?
        `;
            const entity = await AppDataSource.manager
                .query(query, [loginDto.username, new StringTransformer().to(loginDto.password)])



            res.json(entity);
        })

        this.router.post("/", async (req: Request, res: Response) => {

            const user = plainToInstance(Users, req.body.user_info);
            const profile = plainToInstance(CustomerProfile, req.body.profile);

            const errors = await validate(user);
            if (errors.length > 0) {
                res.json(new ResponseMessage({}, 500, errors))
                return;
            }

            try {
                const role = new Role()
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
                res.json(new ResponseMessage({}, 500, [err]))
            }


        });

        this.router.put("/", async (req: Request, res: Response) => {

            const user = plainToInstance(UserUpdateDto, req.body);

            try {
                const userInDB = await AppDataSource.manager.findOne(Users, { where: { id: user.id } })
                if (!userInDB) {
                    res.status(404).json(new ResponseMessage({}, 500, [{ message: "No user found" }]))
                    return;
                }

                const mergedData = AppDataSource.manager.merge(Users, userInDB, user)

                AppDataSource.getRepository(Users).save(mergedData);


                res.status(200).json(mergedData)


            } catch (err) {
                //res.json({ message: "success" });
                console.log(err)
                res.status(500).json(new ResponseMessage({}, 500, [err]))
            }

        });

        this.router.delete("/", async (req: Request, res: Response) => {

            const user = plainToInstance(Users, req.body.user_info);

            try {

                await AppDataSource.manager.transaction(async (manager) => {
                    const userInDB = await manager.findOne(Users, { where: { id: user.id }, relations: ['role'] })
                    if (!userInDB) {
                        throw new Error("No user found");
                    }

                    await manager.delete(Role, userInDB.role.id)
                    await manager.delete(Users, user.id)

                });
                res.status(200).json("User deleted successfully")

            } catch (err) {

                if (err.message === "No user found") {
                    res.status(404).json(new ResponseMessage({}, 404, [{ message: "No user found" }]));
                } else {
                    console.error(err);
                    res.status(500).json(new ResponseMessage({}, 500, [{ message: "An error occurred", details: err.message }]));
                }
            }

        });


    }
}