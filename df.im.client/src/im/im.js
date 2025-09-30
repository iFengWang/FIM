import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  showMain,
  showSetting,
  showChat,
  togglerMain,
  resize,
  togglerSetting,
  togglerChat,
  showHelp,
  togglerHelp,
  getUsers,
} from "./imStore";
import ImMin from "./imMin";
import ImMain from "./imMain";
import ImSetting from "./imSetting";
import ImChat from "./imChat";
import ImHelp from "./imHelp";
import "./im.css";
import { ThemeContext, Themes } from "./imThemeContext";
import VideoInviteContainer from "./VideoInviteContainer";
import { useSocket } from "../contexts/imSocket";
// import { users } from "./imConsts";

function Im(props) {
  const { socket } = useSocket();

  const isShowMain = useSelector(showMain);
  const isShowSetting = useSelector(showSetting);
  const isShowChat = useSelector(showChat);
  const isShowHelp = useSelector(showHelp);

  const dispatch = useDispatch();
  const reFrame = () => dispatch(resize());

  const onKeyDown = (evt) => {
    // enter : 发送消息
    // if (evt.key === "Enter") {
    // }
    // ctrl+alt+m : 切换最小化
    if (evt.ctrlKey && evt.altKey && evt.keyCode === 77) {
      dispatch(togglerMain());
    }

    // ctrl+alt+c : 切换chat对话框
    if (evt.ctrlKey && evt.altKey && evt.keyCode === 67) {
      dispatch(togglerChat());
    }

    // ctrl+alt+f : 切换全屏
    // if (evt.ctrlKey && evt.altKey && evt.keyCode === 70) {
    //   dispatch(togglerChat());
    // }

    // ctrl+alt+s : 切换设置
    if (evt.ctrlKey && evt.altKey && evt.keyCode === 83) {
      dispatch(togglerSetting());
    }

    // ctrl+alt+h : 切换帮助
    if (evt.ctrlKey && evt.altKey && evt.keyCode === 72) {
      dispatch(togglerHelp());
    }
  };

  useEffect(() => {
    if (!socket) return;
    dispatch(getUsers());

    const handleUserDisconnected = (event) => {
      const offLineUsers = event.detail;
      console.log("User disconnected:", offLineUsers);
      // 重新获取用户列表
      dispatch(getUsers());
    };

    window.addEventListener("resize", reFrame);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("user_disconnected", handleUserDisconnected);

    // 清理函数
    return () => {
      window.removeEventListener("resize", reFrame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("user_disconnected", handleUserDisconnected);
    };
  }, [socket, dispatch]);

  return (
    <ThemeContext.Provider value={Themes.red}>
      <VideoInviteContainer />
      {isShowMain ? <ImMain /> : <ImMin />}
      {isShowSetting ? <ImSetting /> : null}
      {isShowChat ? <ImChat /> : null}
      {isShowHelp ? <ImHelp /> : null}
    </ThemeContext.Provider>
  );
}

export default Im;
