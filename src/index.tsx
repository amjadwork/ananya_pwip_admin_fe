import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { ModalsProvider } from "@mantine/modals";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { store } from "./redux/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <NotificationsProvider position="top-right" zIndex={3000}>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </NotificationsProvider>
    </MantineProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
