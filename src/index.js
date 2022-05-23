import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./UIKit/scss/index.scss";
import App from "./App";
import AppProvider from "./AppContext";

ReactDOM.render(
    <AppProvider>
        <App/>
    </AppProvider>,
    document.getElementById("root"));
serviceWorker.register();
