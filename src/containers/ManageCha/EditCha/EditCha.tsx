import React from "react";
import {
  SimpleGrid,
  Box,
  ActionIcon,
  Group,
  Popover,
  Text,
  Button,
  Select,
  Space,
  Title,
  Input,
  Card as SectionCard,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Check, Plus } from "tabler-icons-react";

import PageWrapper from "../../../components/Wrappers/PageWrapper";
import PageHeader from "../../../components/PageHeader/PageHeader";

import EditChaForm from "../../../forms/ManageCha";
import APIRequest from "../../../helper/api";

const RenderPageHeader = (props: any) => {
  const activeFilter = props.activeFilter;
  const handleRadioChange = props.handleRadioChange;

  return (
    <PageHeader
      title="Manage CHA Charges"
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
          onClick={() => {
            handleEditAction(false);
          }}
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
                onClick={() => {
                  handleEditAction(false);
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

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const handleUpdateChaUIData = props.handleUpdateChaUIData;

  return (
    <EditChaForm
      handleCloseModal={handleCloseModal}
      regionSelectOptions={regionSelectOptions}
      destinationSelectOptions={destinationSelectOptions}
      handleUpdateChaUIData={handleUpdateChaUIData}
    />
  );
};

function EditChaContainer(props: any) {
  const editModeActive = props.editModeActive;
  const handleEditAction = props.handleEditAction;
  const modalType = props.modalType || "edit";
  const handleEditToUpdateAction = props.handleEditToUpdateAction;
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const chaData = props.chaData;
  const handleUpdateChaUIData = props.handleUpdateChaUIData;
  const chaAPIPayload = props.chaAPIPayload;
  const handleRefetchChaList = props.handleRefetchChaList;

  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);

  const handleSave = (bool: boolean) => {
    handleEditAction(bool);
  };

  const handleSaveAction = async () => {
    const chaResponse = await APIRequest("cha", "POST", chaAPIPayload);

    if (chaResponse) {
      handleRefetchChaList(chaResponse);
    }
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
          editModeActive={editModeActive}
          handleEditAction={handleSave}
          handleSaveAction={handleSaveAction}
        />
      )}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "edit" ? "Add CHA Charges" : "Update CHA Charges"
      }
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => {
        if (modalType === "edit") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: boolean) => setModalOpen(bool)}
              regionSelectOptions={regionSelectOptions}
              destinationSelectOptions={destinationSelectOptions}
              handleUpdateChaUIData={handleUpdateChaUIData}
            />
          );
        }

        if (modalType === "update") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: boolean) => setModalOpen(bool)}
              regionSelectOptions={regionSelectOptions}
              destinationSelectOptions={destinationSelectOptions}
            />
          );
        }
      }}
      modalSize="70%"
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
          <Title order={1}>CHA Charges</Title>
          <Group spacing="md">
            <Input placeholder="Search" />
            <Button
              type="submit"
              leftIcon={<Plus size={14} />}
              onClick={() => setModalOpen(true)}
            >
              Add
            </Button>
          </Group>
        </Group>
      </Box>

      <Space h="lg" />

      <SimpleGrid cols={2}>
        {chaData.map((item: any, index: number) => {
          return (
            <SectionCard
              key={index}
              withBorder
              radius="md"
              p="lg"
              component="a"
            >
              <Title order={3}>{item?.name}</Title>
              <Space h="xl" />
              <ScrollArea
                scrollbarSize={2}
                style={{ maxHeight: 380, height: 360 }}
              >
                <List type="ordered" spacing="lg">
                  {item?.list?.map((d: any, i: number) => {
                    const destinationName = destinationSelectOptions.find(
                      (f: any) => f.value === d._destinationPortId
                    )?.label;
                    return (
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
                          {destinationName} -{" "}
                          <span style={{ fontWeight: "800" }}>
                            INR {d.chaCharge}
                          </span>
                        </List.Item>
                      </Box>
                    );
                  })}
                </List>
              </ScrollArea>
            </SectionCard>
          );
        })}
      </SimpleGrid>
    </PageWrapper>
  );
}

export default EditChaContainer;
