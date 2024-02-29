import React from "react";
import { Container, Modal, Grid, Box } from "@mantine/core";
import { useStyles } from "../../styles/components/pageWrapper.style";

const PageWrapper = (props: any) => {
  const { classes } = useStyles();

  // const theme = useMantineTheme();

  const children = props.children;

  const PageHeader = props.PageHeader;
  const PageAction = props.PageAction;

  const modalTitle = props.modalTitle;
  const ModalContent = props.ModalContent;
  const onModalClose = props.onModalClose;
  const modalOpen = props.modalOpen;
  const modalSize = props.modalSize || "sm";
  const isVariantProfile = props.isVariantProfile;

  return (
    <Box
      component="div"
      sx={(theme: any) => ({
        padding: "0px 32px",
      })}
    >
      <Grid
        gutter="xl"
        sx={{
          width: "100%",
        }}
      >
        <Grid.Col
          span={12}
          className={classes.grid}
          sx={{
            width: "100%",
          }}
        >
          <Grid
            justify="space-between"
            align="flex-end"
            sx={{
              marginTop: "42px",
              width: "100%",
            }}
          >
            <Grid.Col
              sm={12}
              md={12}
              lg={12}
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
          fullScreen={isVariantProfile}
        >
          <ModalContent />
        </Modal>
      )}
    </Box>
  );
};

export default PageWrapper;
