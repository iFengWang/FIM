import React, { useState, useCallback, useEffect, useRef } from "react";
import WebRTCService from "../services/webrtc";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../contexts/imSocket";
import { addUnreadMessage, setIncomingCall } from "./imStore";
import { togglerChat, clearUnreadMessages } from "./imStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCompress,
  faPhone,
  faPhoneSlash,
  faVideo,
  faSmile,
  faFile,
  faScissors,
  faMicrophone,
  faArrowPointer,
  faCamera,
  faEye,
  faFilm,
  faQrcode,
  faRecordVinyl,
  faMoneyBillTransfer,
  faPaperPlane,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ImDialog } from "./imCore";

function ImChat(props) {
  // private state *************************************
  const [full, setFull] = useState(false);
  const [hideControl, setHideControl] = useState(false);
  const [hideLocalVideo, setHideLocalVideo] = useState(false);
  const [mode, setMode] = useState(1);
  const [showVideoInvite, setShowVideoInvite] = useState(false);
  const incomingCall = useSelector((state) => state.imReducer.incomingCall);
  const webrtcRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const handle = useFullScreenHandle();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // public state *************************************
  const dispatch = useDispatch();
  const {
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
  } = useSocket();
  const size = useSelector((rootState) => rootState.imReducer.size);
  const currentChatUser = useSelector(
    (rootState) => rootState.imReducer.currentChatUser
  );
  let bounds = {
    left: full ? 0 : size.left,
    top: full ? 0 : size.top,
    right: size.right - 170,
    bottom: size.bottom - 50,
  };

  // let localVideoref = React.createRef();
  // let localStream = null;

  const localVideoref = useRef(null);
  const remoteVideoref = useRef(null);

  const onChange = useCallback((state, handle) => {
    setFull(state);
  }, []);

  // component logic *************************************
  const showControl = () => {
    return hideControl ? null : (
      <div className="control-panel">
        <button
          id="callBtn"
          className="im-chat-control-btn"
          onClick={() => {
            // 发送结束视频信号给对方
            if (currentChatUser && currentChatUser.uid) {
              sendVideoEnd(currentChatUser.uid);
            }
            // 本地关闭视频
            stopVideoCall();
            setMode(1); // 切换回文字聊天模式
          }}
        >
          <FontAwesomeIcon icon={faPhoneSlash} />
        </button>
        <button id="muteBtn" className="im-chat-control-btn">
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
        <button id="closeVideoBtn" className="im-chat-control-btn">
          <FontAwesomeIcon icon={faVideo} />
        </button>
        <button id="fullScreenBtn" className="im-chat-control-btn">
          <FontAwesomeIcon icon={faArrowPointer} />
        </button>
        <button id="switchCameraBtn" className="im-chat-control-btn">
          <FontAwesomeIcon icon={faCamera} />
        </button>
        <button
          id="hideBtn"
          className="im-chat-control-btn"
          onClick={() => setHideLocalVideo(!hideLocalVideo)}
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button id="screenBtn" className="im-chat-control-btn">
          <FontAwesomeIcon icon={faFilm} />
        </button>
        <button id="qrBtn" className="im-chat-control-btn">
          <FontAwesomeIcon icon={faQrcode} />
        </button>
        <button id="boardBtn" className="im-chat-control-btn">
          <FontAwesomeIcon icon={faMoneyBillTransfer} />
        </button>
        <button id="recordBtn" className="im-chat-control-btn">
          <FontAwesomeIcon icon={faRecordVinyl} />
        </button>
      </div>
    );
  };

  useEffect(() => {
    if (!socket) return;

    // 初始化WebRTC服务
    webrtcRef.current = new WebRTCService(socket);
    webrtcRef.current.onRemoteStream = (stream) => {
      if (remoteVideoref.current) {
        remoteVideoref.current.srcObject = stream;
      }
    };

    const handleVideoInviteSent = (event) => {
      const data = event.detail;
      console.log("Video invite sent successfully:", data);
      if (data.success) {
        setShowVideoInvite(true);
      }
    };

    const handleVideoInviteFailed = (event) => {
      const data = event.detail;
      console.log("Video invite failed:", data);
      alert(`无法发起视频通话：${data.error}`);
      setShowVideoInvite(false);
      stopVideoCall();
    };

    const handleVideoAccept = async (event) => {
      const data = event.detail;
      console.log("Video call accepted, starting local stream...");
      try {
        // 启动本地视频流
        await startVideoCall(true);
        console.log("Local stream started, creating offer...");

        // 创建并发送 offer
        const offer = await webrtcRef.current.createOffer();
        console.log("Offer created:", offer);
        sendVideoOffer(data.from, offer);
      } catch (error) {
        console.error("Error in handleVideoAccept:", error);
        stopVideoCall();
      }
    };

    const handleVideoReject = () => {
      setShowVideoInvite(false);
      stopVideoCall();
    };

    const handleVideoOffer = async (event) => {
      const data = event.detail;
      console.log("Received video offer:", data);
      try {
        // 启动本地视频流
        await startVideoCall(false);
        console.log("Local stream started for receiver");

        // 处理 offer 并创建 answer
        const answer = await webrtcRef.current.handleOffer(
          data.offer,
          data.from
        );
        console.log("Created answer:", answer);

        // 发送 answer
        sendVideoAnswer(data.from, answer);
      } catch (error) {
        console.error("Error in handleVideoOffer:", error);
        stopVideoCall();
      }
    };

    const handleVideoAnswer = async (event) => {
      const data = event.detail;
      try {
        await webrtcRef.current.handleAnswer(data.answer);
      } catch (error) {
        console.error("Error handling video answer:", error);
      }
    };

    const handleIceCandidate = async (event) => {
      const data = event.detail;
      try {
        await webrtcRef.current.handleIceCandidate(data.candidate);
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    };

    const handleVideoEnd = () => {
      stopVideoCall();
    };

    window.addEventListener("video_invite_sent", handleVideoInviteSent);
    window.addEventListener("video_invite_failed", handleVideoInviteFailed);
    window.addEventListener("video_accept", handleVideoAccept);
    window.addEventListener("video_reject", handleVideoReject);
    window.addEventListener("video_offer", handleVideoOffer);
    window.addEventListener("video_answer", handleVideoAnswer);
    window.addEventListener("ice_candidate", handleIceCandidate);
    window.addEventListener("video_end", handleVideoEnd);

    return () => {
      window.removeEventListener("video_invite_sent", handleVideoInviteSent);
      window.removeEventListener(
        "video_invite_failed",
        handleVideoInviteFailed
      );
      window.removeEventListener("video_accept", handleVideoAccept);
      window.removeEventListener("video_reject", handleVideoReject);
      window.removeEventListener("video_offer", handleVideoOffer);
      window.removeEventListener("video_answer", handleVideoAnswer);
      window.removeEventListener("ice_candidate", handleIceCandidate);
      window.removeEventListener("video_end", handleVideoEnd);
      stopVideoCall();
    };
  }, [socket, currentChatUser]);

  const startVideoCall = async (isInitiator) => {
    try {
      console.log(
        "Starting video call as",
        isInitiator ? "initiator" : "receiver"
      );

      // 切换到视频模式
      setMode(2);
      console.log("Switched to video mode");

      // 等待一下确保视频元素已经渲染
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 启动本地视频流
      await webrtcRef.current.startLocalStream();
      console.log("Local stream started");

      // 设置本地视频显示
      if (localVideoref.current) {
        localVideoref.current.srcObject = webrtcRef.current.localStream;
        console.log("Local video element set up");
      } else {
        console.error("Local video element not found");
        console.log("localVideoref:", localVideoref);
      }

      // 创建对等连接
      await webrtcRef.current.createPeerConnection();
      console.log("Peer connection created");
    } catch (error) {
      console.error("Error in startVideoCall:", error);
      stopVideoCall();
      throw error;
    }
  };

  const stopVideoCall = () => {
    console.log("开始停止视频通话...");

    // 立即切换到文字模式，确保UI响应迅速
    setMode(1);

    const forceStopStream = async (stream) => {
      if (!stream) return;
      try {
        const tracks = stream.getTracks();
        console.log(`停止 ${tracks.length} 个媒体轨道`);

        // 先禁用所有轨道
        tracks.forEach((track) => {
          track.enabled = false;
          track.muted = true;
        });

        // 等待一小段时间确保禁用生效
        await new Promise((resolve) => setTimeout(resolve, 10));

        // 然后停止所有轨道
        tracks.forEach((track) => {
          try {
            track.stop();
            stream.removeTrack(track);
            console.log(`成功停止并移除轨道: ${track.kind}`);
          } catch (err) {
            console.error(`停止轨道失败: ${track.kind}`, err);
          }
        });
      } catch (err) {
        console.error("停止媒体流失败:", err);
      }
    };

    const cleanup = async () => {
      try {
        // 1. 先关闭 WebRTC 连接
        if (webrtcRef.current) {
          console.log("关闭 WebRTC 连接");
          webrtcRef.current.closeConnection();

          if (webrtcRef.current.localStream) {
            console.log("停止 WebRTC 本地流");
            await forceStopStream(webrtcRef.current.localStream);
            webrtcRef.current.localStream = null;
          }
        }

        // 2. 停止并清理本地视频
        if (localVideoref.current && localVideoref.current.srcObject) {
          console.log("清理本地视频元素");
          await forceStopStream(localVideoref.current.srcObject);
          localVideoref.current.srcObject = null;
          localVideoref.current.load(); // 强制重载视频元素
        }

        // 3. 停止并清理远程视频
        if (remoteVideoref.current && remoteVideoref.current.srcObject) {
          console.log("清理远程视频元素");
          await forceStopStream(remoteVideoref.current.srcObject);
          remoteVideoref.current.srcObject = null;
          remoteVideoref.current.load(); // 强制重载视频元素
        }

        // 4. 强制释放所有媒体设备
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        for (const device of videoDevices) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: device.deviceId },
              audio: false,
            });
            await forceStopStream(stream);
          } catch (err) {
            console.log(`设备 ${device.label} 已释放`);
          }
        }

        // 5. 请求垃圾回收
        if (window.gc) {
          window.gc();
        }

        console.log("视频通话停止完成");
      } catch (err) {
        console.error("清理过程中出错:", err);
      }
    };

    // 执行清理
    cleanup();
  };

  const handleVideoButtonClick = async () => {
    try {
      if (!currentChatUser) {
        console.error("No chat user selected");
        return;
      }

      if (mode === 1) {
        // 发送视频通话邀请
        sendVideoInvite(currentChatUser.uid);
        // 预启动本地视频
        try {
          await webrtcRef.current.startLocalStream();
          if (localVideoref.current) {
            localVideoref.current.srcObject = webrtcRef.current.localStream;
          }
        } catch (error) {
          console.error("Error starting local stream:", error);
        }
      } else {
        // 结束视频通话
        sendVideoEnd(currentChatUser.uid);
        stopVideoCall();
      }
    } catch (error) {
      console.error("Error in handleVideoButtonClick:", error);
    }
  };
  // 视频通话接受
  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    sendVideoAccept(incomingCall.from);
    dispatch(setIncomingCall(null));
  };

  // 视频通话拒绝
  const handleRejectCall = () => {
    if (!incomingCall) return;
    sendVideoReject(incomingCall.from);
    dispatch(setIncomingCall(null));
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (currentChatUser && currentChatUser.uid) {
      sendMessage(currentChatUser.uid, message.trim());
      setMessage("");
    } else {
      console.error("No valid chat user selected");
    }
  };

  // 接收消息
  useEffect(() => {
    const handleMessage = (event) => {
      const msg = event.detail;
      // 只显示当前聊天用户的消息
      if (
        currentChatUser &&
        (msg.from?.id === currentChatUser.uid ||
          msg.account?.id === currentChatUser.uid)
      ) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };

    if (socket) {
      window.addEventListener("im_message", handleMessage);

      socket.on("history_messages", (messages) => {
        console.log("Received history messages:", messages);
        // 过滤消息，只显示与当前聊天用户相关的消息
        const filteredMessages = messages.filter(
          (msg) =>
            currentChatUser &&
            (msg.from?.id === currentChatUser.uid ||
              msg.account?.id === currentChatUser.uid)
        );
        setMessages(filteredMessages);
        scrollToBottom();
      });
    }
    return () => {
      window.removeEventListener("im_message", handleMessage);
      if (socket) {
        socket.off("history_messages");
      }
    };
  }, [socket, currentChatUser]);

  // 当打开聊天窗口时，加载历史消息
  useEffect(() => {
    if (socket && currentChatUser) {
      // 清除未读消息计数
      dispatch(clearUnreadMessages({ uid: currentChatUser.uid }));

      // 请求历史消息
      getHistoryMessages(currentChatUser.uid);

      // 清空当前消息列表
      setMessages([]);

      // 更新全局变量，用于未读消息计数判断
      window.currentChatUser = currentChatUser;
    }

    // 组件卸载时清除全局变量
    return () => {
      window.currentChatUser = null;
    };
  }, [socket, currentChatUser, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showLocalVideo = () => {
    return hideLocalVideo ? null : (
      <ImDialog
        padding={"0px"}
        axis={"both"}
        style={{
          position: "absolute", // 添加绝对定位
          top: "20px", // 距离顶部20px
          right: "20px", // 距离右侧20px
          width: "150px",
          height: "150px",
          minWidth: "100px",
          minHeight: "100px",
          backgroundColor: "#000",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          resize: "both",
          zIndex: 1000,
        }}
        // bounds=".im-frame" // 限制拖拽范围在视频聊天窗口内
      >
        <video
          id="localVideo"
          ref={localVideoref}
          autoPlay
          muted
          playsInline
          onDoubleClick={swapVideoStreams}
        ></video>
        <button
          className="btn-close"
          onClick={() => {
            // 发送结束视频信号给对方
            if (currentChatUser && currentChatUser.uid) {
              sendVideoEnd(currentChatUser.uid);
            }
            // 本地关闭视频
            setHideLocalVideo(true);
            stopVideoCall();
            setMode(1); // 切换回文字聊天模式
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </ImDialog>
    );
  };

  // 交换视频流
  const swapVideoStreams = () => {
    if (!localVideoref.current || !remoteVideoref.current) return;

    const localStream = localVideoref.current.srcObject;
    const remoteStream = remoteVideoref.current.srcObject;

    localVideoref.current.srcObject = remoteStream;
    remoteVideoref.current.srcObject = localStream;
  };

  const videoMode = () => {
    console.log("Rendering video mode, localVideoref:", localVideoref.current);
    return (
      <div className="im-frame">
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* 远程视频（大窗口） */}
          <video
            id="remoteVideo"
            ref={remoteVideoref}
            autoPlay
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "#000",
            }}
            onClick={() => setHideControl(!hideControl)}
          />
          {/* 本地视频（小窗口） */}
          {!hideLocalVideo && showLocalVideo()}
          {showControl()}
        </div>
      </div>
    );
  };

  const textMode = () => {
    return (
      <div className="im-frame">
        <div
          className="im-chat"
          style={{ flex: 1, padding: "10px", overflow: "auto" }}
        >
          {messages.map((msg, index) => {
            const currentUid = parseInt(
              new URLSearchParams(window.location.search).get("uId")
            );
            const isMe = msg.from?.id === currentUid;
            console.log(
              "Message sender:",
              msg.from?.id,
              "Current user:",
              currentUid,
              "isMe:",
              isMe
            );
            const time = new Date(msg.timestamp).toLocaleString();

            if (
              index === 0 ||
              new Date(msg.timestamp).getDate() !==
                new Date(messages[index - 1].timestamp).getDate()
            ) {
              return (
                <React.Fragment key={index}>
                  <div className="im-chat-time">{time}</div>
                  <div className={isMe ? "me-chat-panel" : "you-chat-panel"}>
                    {!isMe && (
                      <button className="im-chat-control-btn">
                        <FontAwesomeIcon icon={faUser} />
                      </button>
                    )}
                    <div className={isMe ? "me-chat" : "you-chat"}>
                      {msg.content}
                    </div>
                    {isMe && (
                      <button className="im-chat-control-btn">
                        <FontAwesomeIcon icon={faUser} />
                      </button>
                    )}
                  </div>
                </React.Fragment>
              );
            }

            return (
              <div
                key={index}
                className={isMe ? "me-chat-panel" : "you-chat-panel"}
              >
                {!isMe && (
                  <button className="im-chat-control-btn">
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                )}
                <div className={isMe ? "me-chat" : "you-chat"}>
                  {msg.content}
                </div>
                {isMe && (
                  <button className="im-chat-control-btn">
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="im-chat">
          <div style={{ padding: "5px" }}>
            <button
              className="im-header-button"
              onClick={() => dispatch(togglerChat(currentChatUser))}
              onTouchEnd={() => dispatch(togglerChat(currentChatUser))}
            >
              <FontAwesomeIcon icon={faSmile} />
            </button>
            <button
              className="im-header-button"
              onClick={() => dispatch(togglerChat(currentChatUser))}
              onTouchEnd={() => dispatch(togglerChat(currentChatUser))}
            >
              <FontAwesomeIcon icon={faFile} />
            </button>
            <button
              className="im-header-button"
              onClick={() => dispatch(togglerChat(currentChatUser))}
              onTouchEnd={() => dispatch(togglerChat(currentChatUser))}
            >
              <FontAwesomeIcon icon={faScissors} />
            </button>
            <button
              className="im-header-button"
              onClick={() => dispatch(togglerChat())}
              onTouchEnd={() => dispatch(togglerChat())}
            >
              <FontAwesomeIcon icon={faPhone} />
            </button>
            <button
              className="im-header-button"
              onClick={() => {
                console.log("Video button clicked");
                console.log("Current chat user:", currentChatUser);
                handleVideoButtonClick();
              }}
              onTouchEnd={handleVideoButtonClick}
            >
              <FontAwesomeIcon icon={faVideo} />
            </button>
            <button
              className="im-header-button"
              onClick={handleSendMessage}
              onTouchEnd={handleSendMessage}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
          <div>
            <textarea
              className="im-input"
              type="text"
              placeholder="在此输入文本消息，按回车键发送"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              required
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <FullScreen handle={handle} onChange={onChange}>
      <ImDialog
        point={{ x: full ? 0 : bounds.left + 230, y: full ? 0 : bounds.top }}
        bounds={bounds}
        title={
          <span className="im-header-title">
            {currentChatUser?.name || "聊天"}
          </span>
        }
        buttons={
          <div>
            <button
              className="im-header-button"
              onClick={() => {
                if (!full) {
                  setFull(true);
                  handle.enter();
                } else {
                  setFull(false);
                  handle.exit();
                }
              }}
              onTouchEnd={handle.enter}
            >
              <FontAwesomeIcon icon={faCompress} />
            </button>
            <button
              className="im-header-button"
              onClick={() => dispatch(togglerChat(null))}
              onTouchEnd={() => dispatch(togglerChat(null))}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        }
        style={{
          width: full ? "100vw" : 500,
          height: full ? "100vh" : 500,
          resize: full ? "none" : "both",
          minWidth: 400,
          minHeight: 400,
        }}
        axis={full ? "none" : "both"}
        cancel={".im-frame"}
      >
        {mode === 1 ? textMode() : videoMode()}
      </ImDialog>
    </FullScreen>
  );
}

export default ImChat;
