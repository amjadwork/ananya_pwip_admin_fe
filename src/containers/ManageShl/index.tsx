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
  Badge,
  Input,
  Card as SectionCard,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Check } from "tabler-icons-react";

import EditShlForm from "../../forms/ManageShl/index";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";

import APIRequest from "../../helper/api";

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

function ManageShlContainer() {
  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>("edit");
  const [shlData, setShlData] = React.useState<any>([]);
  const [regionSelectOptions, setRegionSelectOptions] = React.useState<any>([]);
  const [destinationSelectOptions, setDestinationSelectOptions] =
    React.useState<any>([]);
  const [shlAPIPayload, setShlAPIPayload] = React.useState<any>(null);

  const handleRefetchShlList = (chaPostResponse: any) => {
    if (chaPostResponse) {
      handleGetRegionSource();
      getSHLList(chaPostResponse);
    }
  };

  const getSHLList = async (regionList: any) => {
    const shlResponse: any = await APIRequest("shl", "GET");
console.log("abc",regionList);
    if (shlResponse) {
      let array: any = regionList.map((item: any) => {
        let destinationArr: any = [];
        let originIdStringArr: any = [];

        shlResponse.forEach((region: any) => {
          if (item._originId === region._originPortId) {
            destinationArr.push(region.destinations);
            originIdStringArr.push(region._originId);
          }
        });

        return {
          ...item,
          list: originIdStringArr.includes(item._originPortId)
            ? destinationArr.flat(1)
            : [],
        };
      });

      setShlData(() => [...array]);
    }
  };

  const handleEditAction = (bool: boolean) => {
    setEditModeActive(() => bool);
    setModalType("edit");
  };

  const handleEditToUpdateAction = () => {
    setModalType("update");
    setModalOpen(true);
  };

  const handleGetRegionSource = async () => {
    const regionResponse = await APIRequest(
      "location?filterType=origin",
      "GET"
    );
    if (regionResponse) {
      const formattedRegion = regionResponse[0].origin.map((d: any) => {
        return {
          name: d.portName,
          _originId: d._id,
          list: [],
        };
      });

      const regionOptions = regionResponse[0].origin.map((d: any) => {
        return {
          label: d.portName,
          value: d._id,
        };
      });

      setRegionSelectOptions(() => [...regionOptions]);

      handleGetDestination();
      getSHLList(formattedRegion);
    }
  };

  const handleUpdateShlUIData = (formData: any) => {
    setShlAPIPayload({ ...formData });
    let chaArr: any = [...shlData];

    chaArr = chaArr.map((d: any) => {
      if (formData._originPortId === d._originId) {
        return {
          ...d,
          list: [...d.list, ...formData.destinations],
        };
      }
      return {
        ...d,
      };
    });

    setShlData(() => [...chaArr]);
  };

  const handleSaveAction = async () => {
    const shlResponse = await APIRequest("cha", "POST", shlAPIPayload);

    if (shlResponse) {
      //
    }
  };

  const handleGetDestination = async () => {
    const destinationResponse = await APIRequest(
      "location?filterType=destination",
      "GET"
    );

    if (destinationResponse) {
      const destinationOptions = destinationResponse[0].destination.map(
        (d: any) => {
          return {
            label: d.portName,
            value: d._id,
          };
        }
      );

      setDestinationSelectOptions(() => [...destinationOptions]);
    }
  };

  React.useEffect(() => {
    handleGetRegionSource();
  }, []);

  if (editModeActive) {
    return (
      <EditShlForm
        editModeActive={editModeActive}
        handleEditAction={(bool: boolean) => setEditModeActive(() => bool)}
        modalType={modalType}
        modalOpen={modalOpen}
        handleEditToUpdateAction={handleEditToUpdateAction}
        regionSelectOptions={regionSelectOptions}
        destinationSelectOptions={destinationSelectOptions}
        shlData={shlData}
        handleUpdateShlUIData={handleUpdateShlUIData}
        shlAPIPayload={shlAPIPayload}
        handleRefetchShlList={handleRefetchShlList}
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
          <Title order={1}>Shipping Line Locals Charges</Title>
          <Input placeholder="Search" />
        </Group>
      </Box>

      <Space h="lg" />

      <SimpleGrid cols={2}>
        {shlData.map((item: any, index: number) => {
          console.log(item)
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
                    const destinationName = destinationSelectOptions?.find(
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
                            INR {d.shlCharge}
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

export default ManageShlContainer;
