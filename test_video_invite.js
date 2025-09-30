const io = require("socket.io-client");
const assert = require("assert");

// 测试配置
const config = {
  serverUrl: "https://192.168.3.186:3000",
  user1: { uid: 111, name: "王広峰" },
  user2: { uid: 112, name: "陈东洋" },
  socketOptions: {
    path: "/im",
    transports: ["websocket", "polling"],
    secure: true,
    rejectUnauthorized: false,
  },
};

// 创建两个用户的 socket 连接
const createUserSocket = (user) => {
  const socket = io(config.serverUrl, config.socketOptions);

  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      console.log(`User ${user.name} (${user.uid}) connected`);
      socket.emit("register", { uid: user.uid });
      resolve(socket);
    });

    socket.on("connect_error", (error) => {
      console.error(`Connection error for user ${user.name}:`, error);
      reject(error);
    });
  });
};

// 测试视频邀请功能
const testVideoInvite = async () => {
  try {
    console.log("Starting video invite test...");

    // 创建两个用户的连接
    const [socket1, socket2] = await Promise.all([
      createUserSocket(config.user1),
      createUserSocket(config.user2),
    ]);

    // 监听用户2的视频邀请
    let inviteReceived = false;
    socket2.on("video-invite", (data) => {
      console.log("User2 received video invite:", data);
      inviteReceived = true;
      assert.strictEqual(
        data.from,
        config.user1.uid,
        "Invite should be from user1"
      );
      assert.strictEqual(
        data.to,
        config.user2.uid,
        "Invite should be to user2"
      );

      // 发送接收确认
      socket2.emit("video-invite-received", {
        from: config.user2.uid,
        to: config.user1.uid,
      });
    });

    // 等待2秒确保连接稳定
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 用户1发送视频邀请
    console.log("User1 sending video invite...");
    socket1.emit("video-invite", {
      to: config.user2.uid,
      from: config.user1.uid,
    });

    // 等待5秒检查结果
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 验证结果
    assert.strictEqual(
      inviteReceived,
      true,
      "Video invite should be received by user2"
    );

    console.log("Test completed successfully!");

    // 清理连接
    socket1.disconnect();
    socket2.disconnect();
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
};

// 运行测试
console.log("Running video invite tests...");
testVideoInvite().catch(console.error);
