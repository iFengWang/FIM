import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  togglerMain,
  togglerSetting,
  togglerChat,
  togglerHelp,
  clearUnreadMessages,
} from "./imStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faMagnifyingGlass,
  faGear,
  faCircleQuestion,
  faBuildingUser,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ImDialog } from "./imCore";

function ImMain() {
  const dispatch = useDispatch();
  const size = useSelector((state) => state.imReducer.size);
  const users = useSelector((state) => state.imReducer.users);
  const onlineUsers = useSelector((state) => state.imReducer.onlineUsers);
  const unreadMessages = useSelector((state) => state.imReducer.unreadMessages);

  let bounds = {
    left: size.left,
    top: size.top,
    right: size.right - 170,
    bottom: size.bottom - 50,
  };

  const getMeUid = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("uId");
    return parseInt(uid);
  };

  const togglerNode = (node) => {
    if (node.target.tagName === "UL") return;
    let isHide = node.currentTarget.children[1].style.display === "none";
    node.currentTarget.className = isHide
      ? "open department im-node-text"
      : "close department im-node-text";

    for (var i = 1; i < node.currentTarget.children.length; i++) {
      node.currentTarget.children[i].style.display = isHide ? "block" : "none";
    }
  };

  const traverseNode = (nodes) => {
    if (!Array.isArray(nodes)) {
      return [];
    }
    return nodes.map((node) => (
      <li
        key={node.uid + node.type + Math.random()}
        className={
          node.type === "C"
            ? "open department im-node-text"
            : onlineUsers[node.uid]
            ? "user user-online im-node-text"
            : "user user-offline im-node-text"
        }
        onClick={(e) => {
          e.stopPropagation();
          if (node.type === "U") {
            const urlParams = new URLSearchParams(window.location.search);
            const currentUid = parseInt(urlParams.get("uId"));
            if (node.uid === currentUid) {
              alert("不能给自己发消息！");
              return;
            }
            dispatch(togglerChat({ name: node.name, uid: node.uid }));
            dispatch(clearUnreadMessages({ uid: node.uid }));
          } else {
            togglerNode(e);
          }
        }}
        onTouchEnd={(e) => {
          if (node.type === "U") {
            const urlParams = new URLSearchParams(window.location.search);
            const currentUid = parseInt(urlParams.get("uId"));
            if (node.uid === currentUid) {
              alert("不能给自己发消息！");
              return;
            }
            dispatch(togglerChat({ name: node.name, uid: node.uid }));
            dispatch(clearUnreadMessages({ uid: node.uid }));
          }
        }}
      >
        {node.type === "C" ? (
          <FontAwesomeIcon icon={faBuildingUser} className="avtar" />
        ) : (
          <FontAwesomeIcon icon={faUser} className="avtar" />
        )}
        {node.name}
        {node.uid === getMeUid() ? " [Me]" : null}
        {unreadMessages[node.uid] > 0 && (
          <span className="unread-count">{unreadMessages[node.uid]}</span>
        )}

        {node.child ? <ul>{traverseNode(node.child)}</ul> : null}
      </li>
    ));
  };

  return (
    <ImDialog
      point={{ x: bounds.left, y: bounds.top }}
      bounds={bounds}
      title={<span className="im-header-title">IM</span>}
      buttons={
        <div>
          <button
            className="im-header-button"
            onClick={() => dispatch(togglerHelp())}
            onTouchEnd={() => dispatch(togglerHelp())}
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </button>
          <button
            className="im-header-button"
            onClick={() => dispatch(togglerSetting())}
            onTouchEnd={() => dispatch(togglerSetting())}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
          <button
            className="im-header-button"
            onClick={() => dispatch(togglerMain())}
            onTouchEnd={() => dispatch(togglerMain())}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
        </div>
      }
      cancel={".im-header-button, .im-search"}
      style={{
        height: 500,
        width: 205,
        resize: "both",
        minWidth: 205,
        minHeight: 300,
        maxWidth: 250,
      }}
    >
      <div className="im-frame">
        <div className="im-search">
          <input
            className="im-input"
            type="text"
            placeholder="请输入对方的昵称"
            required
          />
          <button className="im-header-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <div className="im-main-list">
          <ul className="domtree">{traverseNode(users)}</ul>
        </div>
      </div>
    </ImDialog>
  );
}

export default ImMain;
