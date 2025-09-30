import * as combineRouters from "koa-combine-routers";
import homeRouter from "./api/home";
import userRouter from "./api/user";

const router = combineRouters(homeRouter, userRouter);

export default router;
