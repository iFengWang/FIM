import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";

import { SocketProvider } from "./contexts/imSocket";

import { imStore } from "./im/imStore";
import Im from "./im/im";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={imStore}>
      <SocketProvider>
        <Im />
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
