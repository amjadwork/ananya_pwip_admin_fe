import React, { useEffect } from "react";
import {
  SimpleGrid,
  Box,
  ActionIcon,
  Group,
  Popover,
  Text,
  Button,
  Space,
  Title,
  Badge,
  Card as SectionCard,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Check, Plus } from "tabler-icons-react";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";

import EditPackagingFormContainer from "./EditPackagingForm";

import { packagingBags } from "../../constants/var.constants";

const RenderPageHeader = (props: any) => {
  const activeFilter = props.activeFilter;
  const handleRadioChange = props.handleRadioChange;

  return <PageHeader title="Manage Packaging" />;
};

const RenderPageAction = (props: any) => {
  const handleSaveAction = props.handleSaveAction;
  const handleEdit = props.handleEdit;
  const editModeActive = props.editModeActive || false;

  if (editModeActive) {
    return (
      <Group position="right" spacing="md">
        <ActionIcon
          variant="filled"
          color="gray"
          sx={{
            "&[data-disabled]": { opacity: 0.4 },
          }}
          onClick={() => {
            handleEdit(false);
          }}
        >
          <X size={16} />
        </ActionIcon>

        <Popover
          width={250}
          trapFocus
          position="bottom-end"
          withArrow
          shadow="lg"
        >
          <Popover.Target>
            <ActionIcon
              variant="filled"
              color="blue"
              sx={{
                "&[data-disabled]": { opacity: 0.4 },
              }}
            >
              <Check size={16} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown
            sx={(theme) => ({
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.white,
            })}
          >
            <Text size="sm">Are you sure you want to save the changes</Text>
            <Space h="sm" />
            <Group position="right" spacing="md">
              <Button
                size="xs"
                color="gray"
                onClick={() => {
                  handleEdit(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                color="blue"
                onClick={() => {
                  if (handleSaveAction) {
                    handleSaveAction();
                  }
                  handleEdit(false);
                }}
              >
                Save
              </Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </Group>
    );
  }

  return (
    <ActionIcon
      variant="filled"
      color="gray"
      sx={{
        "&[data-disabled]": { opacity: 0.4 },
      }}
      onClick={() => {
        handleEdit(true);
      }}
    >
      <Pencil size={16} />
    </ActionIcon>
  );
};

const RenderModalContent = (props: any) => {
  const handleCloseModal =props.handleCloseModal;
  return <EditPackagingFormContainer  handleCloseModal={handleCloseModal} />;
};

function PackagingContainer() {
  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState(false);

  const handleEdit = (bool: boolean) => {
    setEditModeActive(bool);
  };

  return (
    <PageWrapper
      PageHeader={() => (
        <RenderPageHeader
          activeFilter={activeFilter}
          handleRadioChange={(value: any, index: number) =>
            setActiveFilter(index)
          }
        />
      )}
      PageAction={() => (
        <RenderPageAction
          handleEdit={handleEdit}
          editModeActive={editModeActive}
        />
      )}
      modalOpen={modalOpen}
      modalTitle="Add a bag"
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => <RenderModalContent 
        handleCloseModal={(bool: boolean) => setModalOpen(bool)}
        />}
      modalSize="40%"
    >
      <div style={{ width: "100%", height: "auto" }}>
        <Group spacing="md" grow>
          {packagingBags.map((cat: any, index: number) => {
            return (
              <SectionCard
                key={index}
                withBorder
                radius="md"
                p="lg"
                component="a"
              >
                <Group position="apart">
                  <Title order={3}>{cat.name}</Title>

                  {editModeActive && (
                    <ActionIcon
                      variant="light"
                      color="blue"
                      sx={{
                        "&[data-disabled]": { opacity: 0.4 },
                      }}
                      onClick={() => {
                        setModalOpen(true);
                      }}
                    >
                      <Plus size={14} />
                    </ActionIcon>
                  )}
                </Group>
                <Space h="xl" />
                <ScrollArea
                  scrollbarSize={2}
                  style={{ maxHeight: 380, height: 360 }}
                >
                  <List type="ordered" spacing="lg">
                    {cat.list.map((d: any, i: number) => (
                      <Box
                        key={i}
                        sx={(theme) => ({
                          display: "block",
                          backgroundColor:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[6]
                              : "#fff",
                          color:
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[4]
                              : theme.colors.dark[7],
                          textAlign: "left",
                          padding: theme.spacing.md,
                          borderRadius: theme.radius.md,
                          cursor: "default",

                          "&:hover": {
                            backgroundColor:
                              theme.colorScheme === "dark"
                                ? theme.colors.dark[5]
                                : theme.colors.gray[1],
                          },
                        })}
                      >
                        <List.Item>
                          {d.name} -{" "}
                          <span style={{ fontWeight: "600" }}>{d.weight}</span>
                        </List.Item>
                      </Box>
                    ))}
                  </List>
                </ScrollArea>
              </SectionCard>
            );
          })}
        </Group>
      </div>
    </PageWrapper>
  );
}

export default PackagingContainer;
