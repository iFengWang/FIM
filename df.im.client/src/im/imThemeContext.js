import React from "react";

export const Themes = {
  red: {
    foreColor: "#FF0000",
    backColor: "#FF0000",
    shadowColor: "#FF0000",
    borderColor: "#FF0000",
    hoverColor: "#00FF00",
  },
  green: {
    foreColor: "#00FF00",
    backColor: "#00FF00",
    shadowColor: "#00FF00",
    borderColor: "#00FF00",
    hoverColor: "#FF0000",
  },
  yellow: {
    foreColor: "#f8d702",
    backColor: "#f8d702",
    shadowColor: "#f8d702",
    borderColor: "#f8d702",
    hoverColor: "#00FF00",
  },
  gray: {
    foreColor: "#999999",
    backColor: "#999999",
    shadowColor: "#999999",
    borderColor: "#999999",
    hoverColor: "#00FF00",
  },
};

export const ThemeContext = React.createContext(Themes.red);
