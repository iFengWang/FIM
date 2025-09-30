"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.users = void 0;
const Router = require("koa-router");
const router = new Router({ prefix: "/user" });
exports.users = [
    {
        uid: 1,
        name: "DF科技公司",
        type: "C",
        child: [
            {
                uid: 11,
                name: "行政部",
                type: "C",
                child: [
                    { uid: 111, name: "王広峰", type: "U", status: false },
                    { uid: 112, name: "陈东洋", type: "U", status: false },
                    { uid: 113, name: "赵晨", type: "U", status: false },
                    { uid: 114, name: "孟长风", type: "U", status: false },
                    { uid: 116, name: "吴孟达", type: "U", status: false },
                    { uid: 117, name: "周星驰", type: "U", status: false },
                    { uid: 118, name: "刘德华", type: "U", status: false },
                    { uid: 119, name: "周冬宇", type: "U", status: false },
                    { uid: 1110, name: "梁咏褀", type: "U", status: false },
                    { uid: 1111, name: "周迅", type: "U", status: false },
                    {
                        uid: 115,
                        name: "专家组",
                        type: "C",
                        child: [
                            { uid: 1151, name: "王洋", type: "U", status: false },
                            { uid: 1152, name: "何家劲", type: "U", status: false },
                            {
                                did: 1153,
                                name: "突击队",
                                type: "C",
                                child: [
                                    { uid: 11531, name: "刘雅", type: "U", status: false },
                                    { uid: 11532, name: "李加明", type: "U", status: false },
                                    { uid: 11533, name: "陈星", type: "U", status: false },
                                    { uid: 11534, name: "刘大臣", type: "U", status: false },
                                    {
                                        uid: 11535,
                                        name: "一分组",
                                        type: "C",
                                        child: [
                                            { uid: 115351, name: "赵颖", type: "U", status: false },
                                            {
                                                uid: 115352,
                                                name: "高圆圆",
                                                type: "U",
                                                status: false,
                                            },
                                            {
                                                uid: 115353,
                                                name: "第1卡位",
                                                type: "C",
                                                child: [
                                                    {
                                                        uid: 1153531,
                                                        name: "唐高宗",
                                                        type: "U",
                                                        status: false,
                                                    },
                                                    {
                                                        uid: 1153532,
                                                        name: "毛家林",
                                                        type: "U",
                                                        status: false,
                                                    },
                                                    {
                                                        uid: 1153533,
                                                        name: "第1特别行动组",
                                                        type: "C",
                                                        child: [
                                                            {
                                                                uid: 11535331,
                                                                name: "刘家栋",
                                                                type: "U",
                                                                status: false,
                                                            },
                                                            {
                                                                uid: 11535332,
                                                                name: "郑美褀",
                                                                type: "U",
                                                                status: false,
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                did: 1154,
                                name: "后勤队",
                                type: "C",
                                child: [
                                    { uid: 11541, name: "高圆圆", type: "U", status: false },
                                    { uid: 11542, name: "郑伊健", type: "U", status: false },
                                    { uid: 11543, name: "周清明", type: "U", status: false },
                                    { uid: 11544, name: "何忠民", type: "U", status: false },
                                    {
                                        uid: 11545,
                                        name: "二分组",
                                        type: "C",
                                        child: [
                                            { uid: 115451, name: "李颖", type: "U", status: false },
                                            {
                                                uid: 115452,
                                                name: "高爱圆",
                                                type: "U",
                                                status: false,
                                            },
                                            {
                                                uid: 115453,
                                                name: "第2卡位",
                                                type: "C",
                                                child: [
                                                    {
                                                        uid: 1154531,
                                                        name: "刘仁心",
                                                        type: "U",
                                                        status: false,
                                                    },
                                                    {
                                                        uid: 1154532,
                                                        name: "孙玉林",
                                                        type: "U",
                                                        status: false,
                                                    },
                                                    {
                                                        uid: 1154533,
                                                        name: "第2特别行动组",
                                                        type: "C",
                                                        child: [
                                                            {
                                                                uid: 11545331,
                                                                name: "郑虎",
                                                                type: "U",
                                                                status: false,
                                                            },
                                                            {
                                                                uid: 11545332,
                                                                name: "周昌",
                                                                type: "U",
                                                                status: false,
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        uid: 116,
                        name: "顾问组",
                        type: "C",
                        child: [
                            { uid: 1161, name: "钱家明", type: "U", status: false },
                            { uid: 1162, name: "何东仁", type: "U", status: false },
                            { uid: 1163, name: "马立心", type: "U", status: false },
                        ],
                    },
                ],
            },
            {
                uid: 12,
                name: "人事部",
                type: "C",
                child: [
                    { uid: 121, name: "张仁义", type: "U", status: false },
                    { uid: 122, name: "魏东庭", type: "U", status: false },
                    { uid: 123, name: "郑小月", type: "U", status: false },
                    { uid: 124, name: "吴宝", type: "U", status: false },
                    {
                        uid: 125,
                        name: "一分队",
                        type: "C",
                        child: [
                            { uid: 1251, name: "李佳明", type: "U", status: false },
                            { uid: 1252, name: "郑少芬", type: "U", status: false },
                            { uid: 1253, name: "孙东东", type: "U", status: false },
                            { uid: 1254, name: "李小玲", type: "U", status: false },
                        ],
                    },
                    {
                        uid: 126,
                        name: "二分队",
                        type: "C",
                        child: [
                            { uid: 1261, name: "王思宇", type: "U", status: false },
                            { uid: 1262, name: "张美琦", type: "U", status: false },
                            { uid: 1263, name: "李玉梦", type: "U", status: false },
                            { uid: 1264, name: "冯敏", type: "U", status: false },
                        ],
                    },
                ],
            },
            {
                uid: 13,
                name: "研发部",
                type: "C",
                child: [
                    { uid: 131, name: "王子龙", type: "U", status: false },
                    { uid: 132, name: "苏美琪", type: "U", status: false },
                    { uid: 133, name: "关东月", type: "U", status: false },
                    { uid: 134, name: "刘畅游", type: "U", status: false },
                    {
                        uid: 135,
                        name: "服务研发",
                        type: "C",
                        child: [
                            { uid: 1351, name: "贾冬冬", type: "U", status: false },
                            { uid: 1352, name: "郑明强", type: "U", status: false },
                            { uid: 1353, name: "吴关照", type: "U", status: false },
                            { uid: 1354, name: "李爱丽", type: "U", status: false },
                            { uid: 1355, name: "王子娇", type: "U", status: false },
                            { uid: 1356, name: "李美玉", type: "U", status: false },
                            { uid: 1357, name: "郑介民", type: "U", status: false },
                            { uid: 1358, name: "毛成玲", type: "U", status: false },
                            { uid: 1359, name: "钱学习", type: "U", status: false },
                            { uid: 13510, name: "忠长久", type: "U", status: false },
                            { uid: 13511, name: "赵凤褀", type: "U", status: false },
                            { uid: 13512, name: "孙天英", type: "U", status: false },
                            { uid: 13513, name: "张美褀", type: "U", status: false },
                            { uid: 13514, name: "李强", type: "U", status: false },
                            { uid: 13515, name: "王恩弟", type: "U", status: false },
                        ],
                    },
                    {
                        uid: 136,
                        name: "前端研发",
                        type: "C",
                        child: [
                            { uid: 1361, name: "贺飞龙", type: "U", status: false },
                            { uid: 1362, name: "赵胜强", type: "U", status: false },
                            { uid: 1363, name: "刘爱民", type: "U", status: false },
                            { uid: 1364, name: "别家君", type: "U", status: false },
                            { uid: 1365, name: "孙其锋", type: "U", status: false },
                            { uid: 1366, name: "李承民", type: "U", status: false },
                            { uid: 1367, name: "赵万河", type: "U", status: false },
                            { uid: 1368, name: "胡爱民", type: "U", status: false },
                            { uid: 1369, name: "刘忠长", type: "U", status: false },
                            { uid: 13610, name: "郑佳浩", type: "U", status: false },
                            { uid: 13611, name: "卢思宇", type: "U", status: false },
                            { uid: 13612, name: "周玉玲", type: "U", status: false },
                            { uid: 13613, name: "何洪山", type: "U", status: false },
                            { uid: 13614, name: "冯玉祥", type: "U", status: false },
                            { uid: 13615, name: "阎锡山", type: "U", status: false },
                        ],
                    },
                ],
            },
        ],
    },
];
router.get("/:uid", async (ctx, next) => {
    // 添加CORS头
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    ctx.set("Access-Control-Allow-Headers", "Content-Type");
    if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
        return;
    }
    const uId = parseInt(ctx.params.uid);
    // 更新用户状态
    exports.users.forEach(org => {
        if (org.child) {
            findUser(org.child, uId);
        }
    });
    ctx.body = exports.users;
});
function findUser(userChildren, uid) {
    userChildren.map((item) => {
        if (item.uid === uid) {
            item.status = true;
        }
        else {
            if (item.child)
                findUser(item.child, uid);
        }
    });
    return userChildren;
}
exports.findUser = findUser;
exports.default = router;
