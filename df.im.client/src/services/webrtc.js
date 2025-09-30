class WebRTCService {
  constructor(socket) {
    this.socket = socket;
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };
  }

  async startLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return this.localStream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  }

  async createPeerConnection() {
    try {
      this.peerConnection = new RTCPeerConnection(this.configuration);

      // 添加本地流
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      // 处理远程流
      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0];
        if (this.onRemoteStream) {
          this.onRemoteStream(this.remoteStream);
        }
      };

      // 处理ICE候选
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit("ice-candidate", {
            candidate: event.candidate,
            to: this.remoteUserId,
          });
        }
      };

      return this.peerConnection;
    } catch (error) {
      console.error("Error creating peer connection:", error);
      throw error;
    }
  }

  async createOffer() {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  async handleOffer(offer, fromUserId) {
    try {
      this.remoteUserId = fromUserId;
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error handling offer:", error);
      throw error;
    }
  }

  async handleAnswer(answer) {
    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (error) {
      console.error("Error handling answer:", error);
      throw error;
    }
  }

  async handleIceCandidate(candidate) {
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
      throw error;
    }
  }

  closeConnection() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
  }
}

export default WebRTCService;
