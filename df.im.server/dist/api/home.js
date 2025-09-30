"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const router = new Router({ prefix: "/home" });
router.get("/", async (ctx, next) => {
    ctx.body = "Some Home";
});
exports.default = router;
