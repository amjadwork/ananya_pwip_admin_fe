import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

const REACT_APP_AUTH0_DOMAIN: string = process.env
  .REACT_APP_AUTH0_DOMAIN as string;
const REACT_APP_AUTH0_CLIENT_ID: string = process.env
  .REACT_APP_AUTH0_CLIENT_ID as string;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <MantineProvider withNormalizeCSS withGlobalStyles>
    <NotificationsProvider position="bottom-center">
      <Auth0Provider
        domain={REACT_APP_AUTH0_DOMAIN}
        clientId={REACT_APP_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window?.location?.origin || "http://localhost:3000/",
          display: "popup",
        }}
      >
        <App />
      </Auth0Provider>
      ,
    </NotificationsProvider>
  </MantineProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
