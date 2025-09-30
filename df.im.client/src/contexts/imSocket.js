import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import {
  updateUserStatus,
  addUnreadMessage,
  setIncomingCall,
} from "../im/imStore";

// 创建socket实例
const protocol = window.location.protocol;
const hostname = window.location.hostname;
const socket = io(`${protocol}//${hostname}:3000`, {
  path: "/im",
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  pingTimeout: 60000,
  pingInterval: 25000,
  secure: true,
  rejectUnauthorized: false,
  autoConnect: true,
  forceNew: false,
  upgrade: true,
  rememberUpgrade: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
});

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      console.error("Socket instance not found");
      return;
    }

    // 设置事件监听器
    const handleConnect = () => {
      console.log("Socket connected");
      setConnected(true);

      // 发送注册消息
      const urlParams = new URLSearchParams(window.location.search);
      const uid = parseInt(urlParams.get("uId"));
      if (uid) {
        console.log("Registering user:", uid);
        socket.emit("register", { uid });
      } else {
        console.error("No user ID found in URL");
      }
    };

    socket.on("connect", handleConnect);

    // 如果已经连接，立即注册
    if (socket.connected) {
      handleConnect();
    }

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connect error:", error);
    });

    socket.on("user_status", (data) => {
      console.log("User status update:", data);
      dispatch(updateUserStatus(data));
    });

    socket.on("initial_user_status", (users) => {
      console.log("Initial user status:", users);
      users.forEach((user) => {
        dispatch(updateUserStatus(user));
      });
    });

    socket.on("message", (msg) => {
      console.log("Received message:", msg);
      // 触发消息事件，让 imChat 组件可以监听到
      window.dispatchEvent(new CustomEvent("im_message", { detail: msg }));
    });

    // 监听视频通话邀请
    const handleVideoInvite = (data) => {
      console.log("========== Video Invite Start ==========");
      console.log("Received video invite:", data);

      const urlParams = new URLSearchParams(window.location.search);
      const myUid = parseInt(urlParams.get("uId"));

      console.log("Current user info:", {
        uid: myUid,
        connected: socket.connected,
        socketId: socket.id,
      });

      console.log("Invite details:", data);

      // 确保这个邀请是发给我的
      if (myUid === data.to) {
        console.log(
          "This invite is for me, dispatching to Redux and showing dialog"
        );

        // 确保数据格式正确
        const callData = {
          from: data.from,
          fromName: data.fromName,
          to: data.to,
          timestamp: data.timestamp || new Date().toISOString(),
        };

        console.log("Dispatching call data:", callData);
        window.dispatchEvent(
          new CustomEvent("video_invite_received", { detail: callData })
        );
        dispatch(setIncomingCall(callData));

        // 确认收到邀请
        console.log("Sending invite received confirmation");
        socket.emit("video-invite-received", {
          from: myUid,
          to: data.from,
        });
      } else {
        console.log("Ignoring invite - not meant for me");
        console.log("Expected uid:", data.to);
        console.log("My uid:", myUid);
      }
      console.log("========== Video Invite End ==========");
    };

    socket.on("video-invite", handleVideoInvite);

    socket.on("unread_message", (data) => {
      console.log("Received unread message notification:", data);
      // 获取当前聊天用户
      const currentChatUser = window.currentChatUser;
      // 只有在未打开与发送者的聊天窗口时，才增加未读消息计数
      if (!currentChatUser || currentChatUser.uid !== data.fromUid) {
        dispatch(addUnreadMessage({ fromUid: data.fromUid }));
      }
    });

    // 发送心跳包
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("pp");
      }
    }, 25000);

    // 接收心跳包
    socket.on("pp", () => {
      console.log("pingpong......It work!");
    });

    // 监听视频邀请发送成功
    socket.on("video-invite-sent", (data) => {
      console.log("Video invite sent successfully:", data);
      window.dispatchEvent(
        new CustomEvent("video_invite_sent", { detail: data })
      );
    });

    // 监听视频邀请失败
    socket.on("video-invite-failed", (data) => {
      console.log("Video invite failed:", data);
      window.dispatchEvent(
        new CustomEvent("video_invite_failed", { detail: data })
      );
    });

    // 监听视频通话接受
    socket.on("video-accept", (data) => {
      console.log("Video call accepted:", data);
      window.dispatchEvent(new CustomEvent("video_accept", { detail: data }));
    });

    // 监听视频通话拒绝
    socket.on("video-reject", (data) => {
      console.log("Video call rejected:", data);
      window.dispatchEvent(new CustomEvent("video_reject", { detail: data }));
    });

    // 监听视频offer
    socket.on("video-offer", (data) => {
      console.log("Received video offer:", data);
      window.dispatchEvent(new CustomEvent("video_offer", { detail: data }));
    });

    // 监听视频answer
    socket.on("video-answer", (data) => {
      console.log("Received video answer:", data);
      window.dispatchEvent(new CustomEvent("video_answer", { detail: data }));
    });

    // 监听ICE候选
    socket.on("ice-candidate", (data) => {
      console.log("Received ICE candidate:", data);
      window.dispatchEvent(new CustomEvent("ice_candidate", { detail: data }));
    });

    // 监听视频结束
    socket.on("video-end", (data) => {
      console.log("Video call ended:", data);
      window.dispatchEvent(new CustomEvent("video_end", { detail: data }));
    });

    // 监听用户断开连接事件
    socket.on("user_disconnected", (offLineUsers) => {
      console.log("User disconnected:", offLineUsers);
      window.dispatchEvent(
        new CustomEvent("user_disconnected", { detail: offLineUsers })
      );
    });

    // 组件卸载时清理事件监听器
    return () => {
      clearInterval(pingInterval);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
      socket.off("connect_error");
      socket.off("user_status");
      socket.off("video-invite");
      socket.off("initial_user_status");
      socket.off("unread_message");
      socket.off("message");
      socket.off("pp");
      socket.off("video-invite-sent");
      socket.off("video-invite-failed");
      socket.off("video-accept");
      socket.off("video-reject");
      socket.off("video-offer");
      socket.off("video-answer");
      socket.off("ice-candidate");
      socket.off("video-end");
      socket.off("user_disconnected");
    };
  }, [dispatch]);

  const sendMessage = (toUid, message) => {
    if (!socket || !connected) {
      console.error("Socket not connected");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const fromUid = parseInt(urlParams.get("uId"));
    const fromName = urlParams.get("uName");

    socket.emit("message", {
      account: { id: toUid },
      from: { id: fromUid, name: fromName },
      content: message,
      timestamp: new Date().toISOString(),
    });
  };

  const sendVideoInvite = (toUid) => {
    if (!socket || !connected) {
      console.error("Socket not connected");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const fromUid = parseInt(urlParams.get("uId"));
    const fromName = urlParams.get("uName");

    if (!fromUid) {
      console.error("Sender ID not found in URL parameters");
      return;
    }

    console.log("Sending video invite to:", {
      to: toUid,
      from: fromUid,
      fromName,
      timestamp: new Date().toISOString(),
    });

    socket.emit("video-invite", {
      to: toUid,
      from: fromUid,
      fromName,
      timestamp: new Date().toISOString(),
    });
  };

  const sendVideoAccept = (toUid) => {
    if (!socket || !connected) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fromUid = parseInt(urlParams.get("uId"));

    socket.emit("video-accept", {
      to: toUid,
      from: fromUid,
    });
  };

  const sendVideoReject = (toUid) => {
    if (!socket || !connected) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fromUid = parseInt(urlParams.get("uId"));

    socket.emit("video-reject", {
      to: toUid,
      from: fromUid,
    });
  };

  const sendVideoOffer = (toUid, offer) => {
    if (!socket || !connected) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fromUid = parseInt(urlParams.get("uId"));

    socket.emit("video-offer", {
      to: toUid,
      from: fromUid,
      offer,
    });
  };

  const sendVideoAnswer = (toUid, answer) => {
    if (!socket || !connected) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fromUid = parseInt(urlParams.get("uId"));

    socket.emit("video-answer", {
      to: toUid,
      from: fromUid,
      answer,
    });
  };

  const sendIceCandidate = (toUid, candidate) => {
    if (!socket || !connected) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fromUid = parseInt(urlParams.get("uId"));

    socket.emit("ice-candidate", {
      to: toUid,
      from: fromUid,
      candidate,
    });
  };

  const sendVideoEnd = (toUid) => {
    if (!socket || !connected) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fromUid = parseInt(urlParams.get("uId"));

    socket.emit("video-end", {
      to: toUid,
      from: fromUid,
    });
  };

  const getHistoryMessages = (toUid) => {
    if (!socket || !connected) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fromUid = parseInt(urlParams.get("uId"));

    socket.emit("get_history", {
      fromUid,
      toUid,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        sendMessage,
        sendVideoInvite,
        sendVideoAccept,
        sendVideoReject,
        sendVideoOffer,
        sendVideoAnswer,
        sendIceCandidate,
        sendVideoEnd,
        getHistoryMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
