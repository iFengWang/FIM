import * as Router from "koa-router";
const router = new Router({ prefix: "/home" });

router.get("/", async (ctx, next) => {
  ctx.body = "Some Home";
});

export default router;
