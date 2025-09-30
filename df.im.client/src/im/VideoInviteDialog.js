import React from "react";
import "./im.css";

function VideoInviteDialog({ caller, onAccept, onReject }) {
  return (
    <div className="video-invite-dialog">
      <div className="video-invite-content">
        <h3>视频通话邀请</h3>
        <p>{caller} 邀请你进行视频通话</p>
        <div className="video-invite-buttons">
          <button onClick={onReject}>拒绝</button>
          <button onClick={onAccept}>接受</button>
        </div>
      </div>
    </div>
  );
}

export default VideoInviteDialog;
