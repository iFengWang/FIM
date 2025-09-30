import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { togglerMain } from "./imStore";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { ImDialog } from "./imCore";
import "./im.css";

function ImMin() {
  const { size, zIndex, unreadMessages } = useSelector(
    (state) => state.imReducer
  );
  const hasUnreadMessages = Object.values(unreadMessages).some(
    (count) => count > 0
  );
  const dispatch = useDispatch();
  const bounds = {
    left: size.left,
    top: size.top,
    right: size.right - 40,
    bottom: size.bottom - 40,
  };

  const handleClick = () => {
    dispatch(togglerMain());
  };

  return (
    <ImDialog
      point={{ x: bounds.left, y: bounds.top }}
      bounds={bounds}
      style={{
        height: 50,
        width: 50,
        resize: "vertical",
        borderRadius: 30,
        minHeight: 50,
        minWidth: 50,
      }}
      padding={"0px"}
      cancel={"FontAwesomeIcon"}
    >
      <FontAwesomeIcon
        icon={faComments}
        onClick={handleClick}
        onTouchEnd={handleClick}
        className={classNames("im-icon", { blink: hasUnreadMessages })}
      />
    </ImDialog>
  );
}

export default ImMin;
