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
  Input,
  Space,
  Title,
  Badge,
  Card as SectionCard,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Check, Plus } from "tabler-icons-react";

import PageWrapper from "../../../components/Wrappers/PageWrapper";
import PageHeader from "../../../components/PageHeader/PageHeader";

import EditShlForm from "./EditShlForm";

import APIRequest from "../../../helper/api";

const RenderPageHeader = (props: any) => {
  const activeFilter = props.activeFilter;
  const handleRadioChange = props.handleRadioChange;

  return (
    <PageHeader
      title="Manage Shipping Line Locals Charges"
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
            console.log("here");
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
  const handleUpdateShlUIData = props.handleUpdateShlUIData;

  return (
    <EditShlForm
      handleCloseModal={handleCloseModal}
      regionSelectOptions={regionSelectOptions}
      destinationSelectOptions={destinationSelectOptions}
      handleUpdateShlUIData={handleUpdateShlUIData}
    />
  );
};

function EditShlContainer(props: any) {
  const editModeActive = props.editModeActive;
  const handleEditAction = props.handleEditAction;
  const modalType = props.modalType || "edit";
  const handleEditToUpdateAction = props.handleEditToUpdateAction;

  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const shlData = props.shlData;
  const handleUpdateShlUIData = props.handleUpdateShlUIData;
  const shlAPIPayload = props.shlAPIPayload;
  const handleRefetchShlList = props.handleRefetchShlList;

  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);

  const handleSave = (bool: boolean) => {
    handleEditAction(bool);
  };

  const handleSaveAction = async () => {
    const chaResponse = await APIRequest("shl", "POST", shlAPIPayload);

    if (chaResponse) {
      handleRefetchShlList(chaResponse);
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
        modalType === "edit"
          ? "Add Shipping Line Local Charges"
          : "Update Shipping Line Local Charges"
      }
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => {
        if (modalType === "edit") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: any) => setModalOpen(bool)}
              regionSelectOptions={regionSelectOptions}
              destinationSelectOptions={destinationSelectOptions}
              handleUpdateShlUIData={handleUpdateShlUIData}
            />
          );
        }

        if (modalType === "update") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: any) => setModalOpen(bool)}
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
          <Title order={1}>Shipping Line Locals Charges</Title>
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
        {shlData.map((item: any, index: number) => {
          return (
            <SectionCard
              key={index}
              withBorder
              radius="md"
              p="lg"
              component="a"
            >
              <Title order={3}>{item.name}</Title>
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
                        <Group position="apart">
                          <List.Item>
                            {destinationName} -{" "}
                            <span style={{ fontWeight: "800" }}>
                              INR {d.shlCharge}
                            </span>
                          </List.Item>

                          <ActionIcon
                            variant="outline"
                            color="gray"
                            size="sm"
                            sx={{
                              "&[data-disabled]": { opacity: 0.4 },
                            }}
                            onClick={() => {
                              handleEditToUpdateAction();
                              setModalOpen(true);
                              console.log(d);
                            }}
                          >
                            <Pencil size={12} />
                          </ActionIcon>
                        </Group>
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

export default EditShlContainer;
