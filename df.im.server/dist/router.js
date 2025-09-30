"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const combineRouters = require("koa-combine-routers");
const home_1 = require("./api/home");
const user_1 = require("./api/user");
const router = combineRouters(home_1.default, user_1.default);
exports.default = router;
