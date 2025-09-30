import React, { useState, useCallback } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useSelector, useDispatch } from "react-redux";
import { togglerHelp } from "./imStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCompress } from "@fortawesome/free-solid-svg-icons";
import { ImDialog } from "./imCore";

function ImHelp() {
  const [full, setFull] = useState(false);
  const handle = useFullScreenHandle();
  const dispatch = useDispatch();
  const size = useSelector((state) => state.imReducer.size);
  let bounds = {
    left: full ? 0 : size.left,
    top: full ? 0 : size.top,
    right: size.right - 170,
    bottom: size.bottom - 50,
  };

  const onChange = useCallback((state, handle) => {
    setFull(state);
  }, []);

  return (
    <FullScreen handle={handle} onChange={onChange}>
      <ImDialog
        point={{
          x: full ? 0 : bounds.left + 260,
          y: full ? 0 : bounds.top + 50,
        }}
        bounds={bounds}
        title={<span className="im-header-title">帮助</span>}
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
              onClick={() => dispatch(togglerHelp())}
              onTouchEnd={() => dispatch(togglerHelp())}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        }
        style={{
          width: full ? "100vw" : 600,
          height: full ? "100vh" : 600,
          resize: full ? "none" : "both",
          minWidth: 300,
          minHeight: 500,
        }}
        axis={full ? "none" : "both"}
      >
        <div className="im-frame" style={{ background: "#eee" }}>
          <p>
            DF即时通讯系统，是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议、消息通知等功能。
          </p>
          <p>
            enter : 发送消息
            <br />
            ctrl+alt+m : 切换最小化
            <br />
            ctrl+alt+c : 切换chat对话框
            <br />
            ctrl+alt+s : 切换设置
            <br />
            ctrl+alt+h : 切换帮助
            <br />
          </p>
          <p>
            DF即时通讯系统，是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议等功能。
          </p>
          <p>
            DF即时通讯系统，是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字交流、语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议等功能。
          </p>
          <p>
            DF即时通讯系统，是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字交流、语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议等功能。
          </p>
          <p>
            DF即时通讯系统，是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字交流、语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议等功能。
          </p>
          <p>
            DF即时通讯系统，是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字交流、语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议等功能。
          </p>
          <p>
            DF即时通讯系统，是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字交流、语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议等功能。
          </p>
          <p>
            DF即时通讯系统，是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字交流、语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议等功能。
          </p>
          <p>
            DF即时通讯系统，是一款为满足企业内部员工之间的沟通，而提供的一款工具，具备文字交流、语音视频交流、文件传输、电子白板、屏幕共享、远程控件、组建会议等功能。
          </p>
        </div>
      </ImDialog>
    </FullScreen>
  );
}

export default ImHelp;
