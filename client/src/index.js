import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; //don't need to specify localhost url in axios http address
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

//style
import "./index.css";

const theme = createMuiTheme({
  palette: {
    primary: {
	  main: "#212121",
	  secondary: '#616161'
    },
    secondary: {
      main: "#ffff00"
    }
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MuiThemeProvider>,
  document.getElementById("root")
);
