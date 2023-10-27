import React from "react";
import { Header as HeaderWrapper } from "@mantine/core";
import Header from "../../components/common/Header";

function OldAdminPanelScreen() {
  const [opened, setOpened] = React.useState(false);

  return (
    <React.Fragment>
      <HeaderWrapper height={70} p="md">
        <Header
          action={() => null}
          opened={opened}
          onClickBurger={() => setOpened((o) => !o)}
        />
      </HeaderWrapper>
      <iframe
        src="https://admin-old.pwip.co/login"
        frameBorder="0"
        allowFullScreen
        style={{
          boxSizing: "border-box",
          height: "calc(100vh - 74px)",
          width: "calc(100vw - 4px)",
        }}
      />
    </React.Fragment>
  );
}

export default OldAdminPanelScreen;
