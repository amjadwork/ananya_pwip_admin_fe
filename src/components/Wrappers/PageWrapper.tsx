import React from "react";
import { Container, Modal, Grid, useMantineTheme } from "@mantine/core";
import { useStyles } from "../../styles/components/pageWrapper.style";

const PageWrapper = (props: any) => {
  const { classes } = useStyles();

  const theme = useMantineTheme();

  const children = props.children;

  const PageHeader = props.PageHeader;
  const PageAction = props.PageAction;

  const modalTitle = props.modalTitle;
  const ModalContent = props.ModalContent;
  const onModalClose = props.onModalClose;
  const modalOpen = props.modalOpen;
  const modalSize = props.modalSize || "sm";

  return (
    <Container>
      <Grid gutter="xl">
        <Grid.Col span={12} className={classes.grid}>
          <Grid justify="space-between" align="flex-end">
            <Grid.Col sm={12} md={12} lg={3}>
              <PageHeader />
            </Grid.Col>
            <Grid.Col
              sm={12}
              md={12}
              lg={9}
              style={{
                width: "100%",
                justifyContent: "flex-end",
                display: "inline-flex",
              }}
            >
              <PageAction />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={12}>{children}</Grid.Col>
      </Grid>

      {PageAction && modalOpen !== undefined && (
        <Modal
          size={modalSize}
          centered
          opened={modalOpen}
          onClose={onModalClose}
          title={modalTitle}
        >
          <ModalContent />
        </Modal>
      )}
    </Container>
  );
};

export default PageWrapper;
