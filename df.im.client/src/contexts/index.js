import React from "react";
import { SocketProvider } from './Socket';
const AppContextProviders = ({ children }) => (React.createElement(SocketProvider, null, children));
export default AppContextProviders;