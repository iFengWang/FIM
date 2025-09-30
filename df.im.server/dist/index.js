"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const router_1 = require("./router");
const fs = require("fs");
const path = require("path");
const socketIO = require("socket.io");
const app = new Koa();
app.use(async (ctx, next) => {
    // ctx.set("Access-Control-Allow-Origin", "https://192.168.0.2:5500");
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
    ctx.set("Access-Control-Allow-Credentials", "true");
    ctx.set("Content-Type", "application/json;charset=utf-8");
    // ctx.set("Access-Control-Max-Age", 300);
    // ctx.set("Access-Control-Expose-Headers", "myData");
    await next();
});
app.use((0, router_1.default)());
// socket logic ...............................................
const sockets = {};
const users = {};
const messageHistory = {}; // 存储消息历史，格式: { "fromUid_toUid": [messages] }
const unreadMessages = {}; // 存储未读消息，格式: { "toUid": { "fromUid": [messages] } }
let serverOption = {
    key: fs.readFileSync(path.join(__dirname, "./cert/key.pem"), "utf8"),
    cert: fs.readFileSync(path.join(__dirname, "./cert/cert.pem"), "utf8"),
};
const server = require("https").createServer(serverOption, app.callback());
// const server = require("http").createServer(app.callback());
const socketOption = {
    path: "/im",
    serveClient: false,
    pingTimeout: 60000,
    pingInterval: 25000,
    cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["content-type"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    maxHttpBufferSize: 1e8,
    connectTimeout: 45000,
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    },
    allowUpgrades: true,
    upgradeTimeout: 30000,
    destroyUpgradeTimeout: 1000
};
const io = new socketIO.Server(server, socketOption);
// 监听端上是否有连接指令
io.on("connection", (socket) => {
    console.log("new conn............", socket.id);
    // console.log("conns............", io.eio.clientsCount);
    // console.log("rooms............", socket.adapter.rooms.length);
    // console.log("links............", socket.nsp.connected);
    // 当有连接时，获取用户ID并保存socket
    socket.on("register", (data) => {
        console.log("\n=== User Registration Start ===");
        console.log("Registration request data:", data);
        console.log("Socket ID:", socket.id);
        console.log("Current sockets:", {
            ids: Object.keys(sockets),
            mapping: Object.entries(sockets).map(([uid, s]) => ({
                uid,
                socketId: s.id,
                connected: s.connected
            }))
        });
        if (data && data.uid) {
            // 先检查是否已经有这个用户的socket
            const existingSocket = sockets[data.uid];
            if (existingSocket) {
                console.log("\nExisting socket found:", {
                    userId: data.uid,
                    socketId: existingSocket.id,
                    connected: existingSocket.connected,
                    rooms: Array.from(existingSocket.rooms || []),
                    handshake: existingSocket.handshake
                });
                // 如果已存在的socket还连接着，先断开它
                if (existingSocket.connected) {
                    console.log("Disconnecting existing socket");
                    existingSocket.disconnect(true);
                }
            }
            // 保存新的socket
            sockets[data.uid] = socket;
            console.log("\nNew socket saved:", {
                userId: data.uid,
                socketId: socket.id,
                connected: socket.connected,
                rooms: Array.from(socket.rooms || []),
                handshake: socket.handshake
            });
            // 将socket加入到以用户ID命名的房间
            const roomName = `user_${data.uid}`;
            socket.join(roomName);
            // 验证房间加入是否成功
            const room = io.sockets.adapter.rooms.get(roomName);
            console.log("\nRoom status after join:", {
                name: roomName,
                exists: !!room,
                size: room === null || room === void 0 ? void 0 : room.size,
                sockets: room ? Array.from(room) : []
            });
            // 广播新用户上线消息
            io.emit("user_status", { uid: data.uid, online: true });
            // 向新用户发送所有当前在线用户的状态
            const onlineUsers = Object.keys(sockets).map(uid => ({
                uid: parseInt(uid),
                online: true
            }));
            socket.emit("initial_user_status", onlineUsers);
            // 检查是否有未读消息
            if (unreadMessages[data.uid]) {
                Object.entries(unreadMessages[data.uid]).forEach(([fromUid, messages]) => {
                    const messageArray = messages;
                    if (messageArray.length > 0) {
                        socket.emit("unread_message", { fromUid: parseInt(fromUid), count: messageArray.length });
                    }
                });
            }
            console.log("\nFinal socket mapping:", {
                totalSockets: Object.keys(sockets).length,
                socketIds: Object.entries(sockets).map(([uid, s]) => ({
                    uid,
                    socketId: s.id
                }))
            });
            console.log("=== User Registration End ===\n");
        }
        else {
            console.error("Invalid registration data:", data);
        }
    });
    // 返回连接成功的反馈
    socket.emit("connected");
    // 监听端上要连接到哪个指定房间
    socket.on("join", (data) => {
        // 根据端上的指令，连接到指定房间
        socket.join(data.roomid);
        if (!users[data.roomid]) {
            users[data.roomid] = [];
        }
        let obj = {
            account: data.account,
            id: socket.id,
        };
        let selfAccount = users[data.roomid].filter((u) => u.account.id === data.account.id);
        if (selfAccount.length === 0) {
            users[data.roomid].push(obj);
            sockets[data.account.id] = socket;
            // 广播
            io.in(data.roomid).emit("joined", data.roomid, users[data.roomid]);
        }
        else {
            // remove old user and disconnect socket
            users[data.roomid] = users[data.roomid].filter((u) => u.account.id !== data.account.id);
            sockets[data.account.id].leave(data.roomid);
            sockets[data.account.id].disconnect(true);
            // add new user to list
            users[data.roomid].push(obj);
            sockets[data.account.id] = socket;
            io.in(data.roomid).emit("joined", data.roomid, users[data.roomid]);
        }
    });
    // 保持心跳...........
    socket.on("pp", () => {
        socket.emit("pp");
    });
    // 获取两个用户之间的历史消息
    socket.on("get_history", (data) => {
        console.log("Getting history for:", data);
        const { fromUid, toUid } = data;
        const key1 = `${fromUid}_${toUid}`;
        const key2 = `${toUid}_${fromUid}`;
        // 合并两个方向的消息并按时间排序
        const messages = [
            ...(messageHistory[key1] || []),
            ...(messageHistory[key2] || [])
        ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        // 清除未读消息
        if (unreadMessages[fromUid] && unreadMessages[fromUid][toUid]) {
            delete unreadMessages[fromUid][toUid];
        }
        socket.emit("history_messages", messages);
    });
    socket.on("message", (msg) => {
        console.log("Received message:", msg);
        try {
            if (msg.account && msg.account.id && msg.from && msg.from.id) {
                const timestamp = new Date().toISOString();
                const messageWithTimestamp = Object.assign(Object.assign({}, msg), { timestamp, unread: true // 标记消息为未读
                 });
                // 存储消息历史
                const historyKey = `${msg.from.id}_${msg.account.id}`;
                if (!messageHistory[historyKey]) {
                    messageHistory[historyKey] = [];
                }
                messageHistory[historyKey].push(messageWithTimestamp);
                // 存储未读消息
                const toUid = msg.account.id;
                const fromUid = msg.from.id;
                if (!unreadMessages[toUid]) {
                    unreadMessages[toUid] = {};
                }
                if (!unreadMessages[toUid][fromUid]) {
                    unreadMessages[toUid][fromUid] = [];
                }
                unreadMessages[toUid][fromUid].push(messageWithTimestamp);
                // 发送给接收者
                if (sockets[toUid]) {
                    console.log("Sending message to receiver:", toUid);
                    // 发送消息
                    sockets[toUid].emit("message", messageWithTimestamp);
                    // 发送未读消息通知
                    sockets[toUid].emit("unread_message", {
                        fromUid,
                        count: unreadMessages[toUid][fromUid].length
                    });
                }
                else {
                    console.log("Receiver socket not found:", toUid);
                }
                // 发送回发送者（用于显示在发送者的聊天框中）
                console.log("Sending message back to sender:", fromUid);
                const messageForSender = Object.assign(Object.assign({}, messageWithTimestamp), { unread: false }); // 发送者看到的消息标记为已读
                socket.emit("message", messageForSender);
            }
            else {
                console.error("Invalid message format:", msg);
            }
        }
        catch (error) {
            console.error("Error processing message:", error);
            socket.emit("error", { message: "Failed to process message" });
        }
    });
    socket.on("call", (data) => {
        if (haveUser(data.account)) {
            sockets[data.account.id].emit("call", data);
        }
    });
    socket.on("reply", (data) => {
        if (haveUser(data.account)) {
            sockets[data.account.id].emit("reply", data);
        }
    });
    // WebRTC信令处理
    socket.on("video-invite-received", (data) => {
        console.log("Video invite received confirmation:", data);
        const { to, from } = data;
        if (sockets[to]) {
            sockets[to].emit("video-invite-confirmed", {
                from
            });
        }
    });
    // 获取用户名称
    const getUserName = (uid) => {
        // 这里应该根据uid从数据库或缓存中获取用户名称
        // 暂时使用一个简单的映射
        const userNames = {
            111: "王広峰",
            112: "陈东洋",
            113: "赵晨",
            114: "吴孟达"
        };
        return userNames[uid] || `用户${uid}`;
    };
    socket.on("video-invite", async (data) => {
        console.log("\n=== Video Invite Start ===");
        console.log("Received video invite:", data);
        const { to, from } = data;
        const fromName = getUserName(from);
        // 等待1秒确保连接稳定
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("\nSocket Status:", {
            totalSockets: Object.keys(sockets).length,
            availableSockets: Object.entries(sockets).map(([uid, s]) => ({
                uid,
                socketId: s.id,
                connected: s.connected
            }))
        });
        console.log("\nRoom Status:", {
            totalRooms: io.sockets.adapter.rooms.size,
            rooms: Array.from(io.sockets.adapter.rooms.entries()).map(([name, room]) => ({
                name,
                size: room.size,
                sockets: Array.from(room)
            }))
        });
        try {
            // 获取目标用户的socket
            const targetSocket = sockets[to];
            if (targetSocket) {
                console.log("\nTarget socket found:", {
                    userId: to,
                    socketId: targetSocket.id,
                    connected: targetSocket.connected,
                    rooms: Array.from(targetSocket.rooms || []),
                    handshake: targetSocket.handshake
                });
                // 只使用直接发送到目标socket的方式
                const message = {
                    from,
                    fromName,
                    to,
                    timestamp: new Date().toISOString()
                };
                console.log("\nSending video invite directly to target socket:", message);
                targetSocket.emit("video-invite", message);
                // 确认发送成功
                socket.emit("video-invite-sent", {
                    to,
                    success: true
                });
                console.log("\nInvite sent confirmation sent to sender");
            }
            else {
                console.log("\nTarget socket not found for user:", to);
                socket.emit("video-invite-failed", {
                    error: "User is not online",
                    to
                });
            }
        }
        catch (error) {
            console.error("\nError in video-invite handler:", error);
            socket.emit("video-invite-failed", {
                error: "Failed to send invite: " + error.message,
                to
            });
        }
        console.log("=== Video Invite End ===\n");
    });
    socket.on("video-accept", (data) => {
        const { to } = data;
        if (sockets[to]) {
            sockets[to].emit("video-accept", {
                from: data.from
            });
        }
    });
    socket.on("video-reject", (data) => {
        const { to } = data;
        if (sockets[to]) {
            sockets[to].emit("video-reject", {
                from: data.from
            });
        }
    });
    socket.on("video-offer", (data) => {
        const { to } = data;
        if (sockets[to]) {
            sockets[to].emit("video-offer", {
                from: data.from,
                offer: data.offer
            });
        }
    });
    socket.on("video-answer", (data) => {
        const { to } = data;
        if (sockets[to]) {
            sockets[to].emit("video-answer", {
                from: data.from,
                answer: data.answer
            });
        }
    });
    socket.on("ice-candidate", (data) => {
        const { to } = data;
        if (sockets[to]) {
            sockets[to].emit("ice-candidate", {
                from: data.from,
                candidate: data.candidate
            });
        }
    });
    socket.on("video-end", (data) => {
        const { to } = data;
        if (sockets[to]) {
            sockets[to].emit("video-end", {
                from: data.from
            });
        }
    });
    socket.on("disconnect", (reason) => {
        console.log("User disconnected, reason:", reason);
        // 找到断开连接的用户ID
        let disconnectedUid = null;
        for (const [uid, s] of Object.entries(sockets)) {
            if (s.id === socket.id) {
                disconnectedUid = parseInt(uid);
                delete sockets[uid];
                break;
            }
        }
        if (disconnectedUid) {
            console.log("User offline:", disconnectedUid);
            io.emit("user_status", { uid: disconnectedUid, online: false });
        }
        // 清理users对象
        for (let k in users) {
            users[k] = users[k].filter((u) => u.id !== socket.id);
        }
    });
    socket.on("error", (error) => {
        console.log("error......", error);
    });
});
const haveUser = (account) => {
    if (!account)
        return false;
    for (let k in users) {
        for (let u of users[k]) {
            if (u.account.id === account.id) {
                return true;
            }
        }
    }
    return false;
};
server.listen(3000);
// socket end ............................................
