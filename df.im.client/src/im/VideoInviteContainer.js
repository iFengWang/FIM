import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../contexts/imSocket";
import { setIncomingCall, togglerChat } from "./imStore";
import VideoInviteDialog from "./VideoInviteDialog";

function VideoInviteContainer() {
  const dispatch = useDispatch();
  const { sendVideoAccept, sendVideoReject } = useSocket();
  const incomingCall = useSelector((state) => state.imReducer.incomingCall);

  const handleAcceptCall = async () => {
    if (!incomingCall) return;

    // 先打开聊天对话框
    dispatch(
      togglerChat({
        uid: incomingCall.from,
        name: incomingCall.fromName,
      })
    );

    // 发送接受信号
    sendVideoAccept(incomingCall.from);

    // 清除邀请状态
    dispatch(setIncomingCall(null));
  };

  const handleRejectCall = () => {
    if (!incomingCall) return;
    sendVideoReject(incomingCall.from);
    dispatch(setIncomingCall(null));
  };

  if (!incomingCall) return null;

  return (
    <VideoInviteDialog
      caller={incomingCall.fromName}
      onAccept={handleAcceptCall}
      onReject={handleRejectCall}
    />
  );
}

export default VideoInviteContainer;
