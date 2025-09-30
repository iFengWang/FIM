import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { togglerSetting } from "./imStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFaceAngry,
  faImage,
  faFire,
  faDollar,
  faPooStorm,
} from "@fortawesome/free-solid-svg-icons";
import { ImDialog } from "./imCore";
import { HuePicker } from "react-color";

function ImSetting() {
  const dispatch = useDispatch();
  const size = useSelector((state) => state.imReducer.size);
  let bounds = {
    left: size.left,
    top: size.top,
    right: size.right - 170,
    bottom: size.bottom - 50,
  };

  const CustomPointer = () => {
    return <div className="custom-pointer" />;
  };

  const onChangeComplete = (color, event) => {
    document.body.style.setProperty(
      "--im-foreground",
      `rgb(${color.rgb.r - 150},${color.rgb.g - 150},${color.rgb.b - 150},${
        color.rgb.a
      })`
    );

    document.body.style.setProperty(
      "--im-background",
      `linear-gradient(110deg,
        rgb(${color.rgb.r + 70},${color.rgb.g + 70},${color.rgb.b + 70}),
        rgb(${color.rgb.r - 70},${color.rgb.g - 70},${color.rgb.b - 70}),
        rgb(${color.rgb.r + 70},${color.rgb.g + 70},${color.rgb.b + 70})
      )`
    );

    document.body.style.setProperty(
      "--im-border",
      `rgb(${color.rgb.r - 100},${color.rgb.g - 100},${color.rgb.b - 100},${
        color.rgb.a
      })`
    );

    document.body.style.setProperty(
      "--im-secondary",
      `rgb(${color.rgb.r + 100},${color.rgb.g + 100},${color.rgb.b + 100},${
        color.rgb.a
      })`
    );

    document.body.style.setProperty(
      "--im-fore-shadow",
      `rgb(${color.rgb.r + 100},${color.rgb.g + 100},${color.rgb.b + 100},${
        color.rgb.a
      })`
    );

    document.body.style.setProperty(
      "--im-back-shadow",
      `rgb(${color.rgb.r - 100},${color.rgb.g - 100},${color.rgb.b - 100},${
        color.rgb.a - 0.7
      })`
    );
  };

  return (
    <ImDialog
      point={{ x: bounds.left + 330, y: bounds.top + 100 }}
      bounds={bounds}
      title={<span className="im-header-title">设置</span>}
      buttons={
        <div>
          <button
            className="im-header-button"
            onClick={() => dispatch(togglerSetting())}
            onTouchEnd={() => dispatch(togglerSetting())}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      }
      style={{ width: 500, height: 370, resize: "none" }}
      cancel={".im-frame"}
    >
      <div className="im-frame">
        <span className="im-child-title">主题颜色</span>
        <div className="im-set" style={{ padding: "10px" }}>
          <HuePicker
            width="100%"
            // height="100%"
            color={{ hex: "#000" }}
            // pointer={CustomPointer}
            // direction={"horizontal" || "vertical"}
            onChangeComplete={onChangeComplete}
          />
        </div>
        <span className="im-child-title">初始位置</span>
        <div className="im-set"></div>
        <span className="im-child-title">用户来源</span>
        <div className="im-set"></div>
        <span className="im-child-title">地址端口</span>
        <div className="im-set"></div>
        <span className="im-child-title">快捷按键</span>
        <div className="im-set"></div>
        <div className="im-frame-foot">
          <button className="im-button">保存</button>
        </div>
      </div>
    </ImDialog>
  );
}

export default ImSetting;
