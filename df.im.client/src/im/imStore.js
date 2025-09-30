import {
  createAsyncThunk,
  createSlice,
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";
import { getUserList } from "./imApi";

const initialState = {
  showMain: false,
  showSetting: false,
  showChat: false,
  showHelp: false,
  size: {
    left: 0,
    top: 0,
    right: window.innerWidth - 20 - 40,
    bottom: window.innerHeight - 20 - 40,
  },
  status: "idle",
  zIndex: 9999,
  users: [],
  currentChatUser: null, // 添加当前聊天用户信息
  onlineUsers: {}, // 在线用户状态
  unreadMessages: {}, // 未读消息计数
  incomingCall: null, // 收到的视频邀请
};

export const getUsers = createAsyncThunk(
  "imReducer/getUsers",
  async (params, { dispatch }) => {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("uId");
    console.log("Getting users for uid:", uid);
    const response = await getUserList(parseInt(uid));
    return response.data;
  }
);

const imSlice = createSlice({
  name: "imReducer", // 生成的action名中会包含此前缀
  initialState,
  reducers: {
    togglerMain: (state) => {
      // action name : 'imReducer/togglerMain'
      state.showMain = !state.showMain;
    },
    resize: (state) => {
      state.size.right = window.innerWidth - 20;
      state.size.bottom = window.innerHeight - 20;
    },
    togglerSetting: (state) => {
      state.showSetting = !state.showSetting;
    },
    togglerChat: (state, action) => {
      if (action.payload) {
        // 如果提供了用户信息，说明是要打开或切换聊天
        state.showChat = true;
        state.currentChatUser = action.payload;
      } else {
        // 如果没有提供用户信息，说明是要关闭聊天窗口
        state.showChat = false;
        state.currentChatUser = null;
      }
    },
    togglerHelp: (state) => {
      state.showHelp = !state.showHelp;
    },
    incrementzIndex: (state) => {
      state.zIndex += 1;
    },
    updateUserStatus: (state, action) => {
      state.onlineUsers[action.payload.uid] = action.payload.online;
    },
    addUnreadMessage: (state, action) => {
      const { fromUid } = action.payload;
      if (!state.unreadMessages[fromUid]) {
        state.unreadMessages[fromUid] = 0;
      }
      state.unreadMessages[fromUid]++;
    },
    clearUnreadMessages: (state, action) => {
      const { uid } = action.payload;
      state.unreadMessages[uid] = 0;
    },
    setIncomingCall: (state, action) => {
      console.log("Setting incoming call:", action.payload);
      state.incomingCall = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "successful";
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        console.error("Failed to get users:", action.error.message);
        state.users = []; // 确保users始终是数组
      });
  },
});

// imSlice actions ************************************************
export const {
  togglerMain,
  resize,
  togglerSetting,
  togglerChat,
  togglerHelp,
  incrementzIndex,
  updateUserStatus,
  addUnreadMessage,
  clearUnreadMessages,
  setIncomingCall,
} = imSlice.actions;

// imReducer states ************************************************
export const showMain = (state) => state.imReducer.showMain;
export const showSetting = (state) => state.imReducer.showSetting;
export const showChat = (state) => state.imReducer.showChat;
export const showHelp = (state) => state.imReducer.showHelp;
export const zIndex = (state) => state.imReducer.zIndex;

// imStore states ************************************************
export const imStore = configureStore({
  reducer: {
    imReducer: imSlice.reducer,
  },
});

// imStore.subscribe(() => console.log(imStore.getState()));
