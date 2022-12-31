import React from "react";
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
  Input,
  Badge,
  Card as SectionCard,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Check } from "tabler-icons-react";

import EditTransportContainer from "./EditTransport/EditTransport";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";

import { manageTransport} from "../../constants/var.constants";

const RenderPageHeader = (props: any) => {
  const activeFilter = props.activeFilter;
  const handleRadioChange = props.handleRadioChange;

  return (
    <PageHeader
      title="Manage Transportation Charges"
      // breadcrumbs={[
      //   { title: "Products", href: "/admin/dashboard/products" },
      //   { title: "Manage", href: "#" },
      // ]}
    />
  );
};

const RenderPageAction = (props: any) => {
  const handleSaveAction = props.handleSaveAction;
  const handleEditAction = props.handleEditAction;
  const editModeActive = props.editModeActive;

  if (editModeActive) {
    return (
      <Group position="right" spacing="md">
        <ActionIcon
          variant="filled"
          color="gray"
          sx={{
            "&[data-disabled]": { opacity: 0.4 },
          }}
          onClick={() => handleEditAction(false)}
        >
          <X size={16} />
        </ActionIcon>

        <Popover
          width={250}
          trapFocus
          position="bottom-end"
          withArrow
          shadow="md"
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
                onClick={() => handleEditAction(false)}
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
                  handleEditAction(false);
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
      onClick={() => handleEditAction(true)}
    >
      <Pencil size={16} />
    </ActionIcon>
  );
};

function ManageTransportContainer() {
  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>("edit");

  const handleEditAction = (bool: boolean) => {
    setEditModeActive(() => bool);
    setModalType("edit");
  };

  const handleEditToUpdateAction = () => {
    setModalType("update");
    setModalOpen(true);
  };

  if (editModeActive) {
    return (
      <EditTransportContainer
        editModeActive={editModeActive}
        handleEditAction={(bool: boolean) => setEditModeActive(() => bool)}
        modalType={modalType}
        modalOpen={modalOpen}
        handleEditToUpdateAction={handleEditToUpdateAction}
      />
    );
  }

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
          handleActionClick={() => setModalOpen(true)}
          handleEditAction={handleEditAction}
          editModeActive={editModeActive}
        />
      )}
    >
      <Box
        sx={(theme) => ({
          display: "block",
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[1],
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.dark[7],
          textAlign: "center",
          padding: theme.spacing.xl,
          borderRadius: theme.radius.md,
          cursor: "default",
        })}
      >
        <Group position="apart">
          <Title order={1}>Transportation Charges</Title>
          <Input
              placeholder="Search"/> 
        </Group>
      </Box>

      <Space h="lg" />

      <SimpleGrid cols={2}>
        {manageTransport.map((cat: any, index: number) => {
          return (
            <SectionCard
              key={index}
              withBorder
              radius="md"
              p="lg"
              component="a"
            >
              <Title order={3}>{cat.name}</Title>
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
                          {d.name}  - RS{" "}
                          <span style={{ fontWeight: "800" }}>{d.price}</span>
                        </List.Item>
                    </Box>
                  ))}
                </List>
              </ScrollArea>
            </SectionCard>
          );
        })}
      </SimpleGrid>
    </PageWrapper>
  );
}

export default ManageTransportContainer;
