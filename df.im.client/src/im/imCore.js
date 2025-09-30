import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Draggable from "react-draggable";
import { incrementzIndex } from "./imStore";
import { ThemeContext, Themes } from "./imThemeContext";

export function ImDialog(props) {
  const dispatch = useDispatch();
  const zIndex = useSelector((state) => state.imReducer.zIndex);

  const nodeRef = useRef(null);
  useEffect((state) => {
    dispatch(incrementzIndex());
    if (!!nodeRef) nodeRef.current.style.zIndex = zIndex;
  }, []);

  let padding = props.padding || "15px";

  const [startPoint, setStartPoint] = useState();

  const themes = useContext(ThemeContext);

  return (
    <Draggable
      allowAnyClick={false}
      enableUserSelectHack={true}
      nodeRef={nodeRef}
      scale={1}
      handle=".im-handler"
      cancel={props.cancel}
      defaultPosition={props.point}
      bounds={props.bounds}
      axis={props.axis}
      onStart={(e) => {
        dispatch(incrementzIndex());
        if (!!nodeRef) nodeRef.current.style.zIndex = zIndex;

        // let beginPoint = e.clientX + "," + e.clientY;
        // setStartPoint(beginPoint);
        // document.body.style.pointerEvents = "auto";
      }}
      // onStop={(e) => {
      //   let stopPoint = e.clientX + "," + e.clientY;
      //   if (startPoint === stopPoint) {
      //     console.log("11111....true");
      //     // document.body.style.pointerEvents = "auto";
      //   } else {
      //     console.log("22222....false");
      //     // document.body.style.pointerEvents = "none";
      //   }
      // }}
    >
      <div className="im-main" style={props.style} ref={nodeRef}>
        <div className="im-handler">
          <div className="im-container" style={{ padding: `0px ${padding}` }}>
            <div className="im-header">
              {props.title}
              {props.buttons}
            </div>
            <div className="im-content">{props.children}</div>
            <div className="im-footer" style={{ height: padding }}></div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
