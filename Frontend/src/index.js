import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./store/index";
import { Provider } from "react-redux";
import "./languages/i18next";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthController from "./components/AuthController";

ReactDOM.render(
  <Suspense fallback={<div className="loading">Loading...</div>}>
    <Provider store={store}>
      <BrowserRouter>
        <AuthController>
          <App />
        </AuthController>
      </BrowserRouter>
    </Provider>
  </Suspense>,
  document.getElementById("root")
);
