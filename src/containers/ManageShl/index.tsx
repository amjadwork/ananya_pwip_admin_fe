import React from "react";
import {
  SimpleGrid,
  Box,
  Group,
  Popover,
  Space,
  Title,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Check } from "tabler-icons-react";
import {
  Card as SectionCard,
  Input,
  Button,
  Text,
  ActionIcon,
} from "../../components/index";

// import {Group,Popover,Space} from "@mantine/core";
// import {Pencil,X,Check} from "tabler-icons-react";
// import {Button,ActionIcon,Text} from "../../components/index";

import EditShlForm from "../../forms/ManageShl/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";
import PageLabel from "../../components/PageLabel/PageLabel";
import CardModal from "../../components/CardModal/CardModal";

import {
  getShlData,
  getDestinationData,
  getRegionSource,
  postShlData,
} from "../../services/export-costing/SHL";

const RenderPageHeader = (props: any) => {
  const activeFilter = props.activeFilter;
  const handleRadioChange = props.handleRadioChange;

  return (
    <PageHeader
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

        <Popover width={200} trapFocus position="bottom" withArrow shadow="md">
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
            sx={(theme: any) => ({
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.white,
            })}
          >
            <Text size="sm">Are you sure you want to save the changes?</Text>
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
  const [dataCopy, setDataCopy] = React.useState<any>([]);

  //What does this below function do? Is it necessary? #askSwain
  const handleRefetchShlList = (shlPostResponse: any) => {
    if (shlPostResponse) {
      handleGetRegionSource();
      getSHLList(shlPostResponse);
    }
  };

  const getSHLList = async (regionList: any) => {
    const shlDataResponse: any = await getShlData(regionList);
    try {
      if (shlDataResponse) {
        console.log(regionList);
        let array: any = regionList?.map((item: any) => {
          let destinationArr: any = [];
          let originIdStringArr: any = [];

          shlDataResponse.forEach((region: any) => {
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
        setDataCopy(() => [...array]);
      }
    } catch (error) {
      console.log(error);
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
    const regionResponse = await getRegionSource();
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
    let shlArr: any = [...shlData];

    shlArr = shlArr.map((d: any) => {
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

    setShlData(() => [...shlArr]);
    setDataCopy(() => [...shlArr]);
  };

  const handleSaveAction = async () => {
    if (shlAPIPayload) {
      const shlResponse = await postShlData(shlAPIPayload);

      if (shlResponse) {
        handleGetRegionSource();
      }
    }
  };

  const handleSave = (bool: boolean) => {
    handleEditAction(bool);
  };

  const handleGetDestination = async () => {
    const destinationResponse = await getDestinationData();

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
          editModeActive={editModeActive}
          handleEditAction={handleSave}
          handleSaveAction={handleSaveAction}
        />
      )}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "edit" ? "Add SHL Charges" : "Update SHL Charges"
      }
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => {
        if (modalType === "edit") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: boolean) => setModalOpen(bool)}
              regionSelectOptions={regionSelectOptions}
              destinationSelectOptions={destinationSelectOptions}
              handleUpdateShlUIData={handleUpdateShlUIData}
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
      <PageLabel
        title="Shipping Line Locals Charges"
        editModeActive={editModeActive}
        setModalOpen={setModalOpen}
      />
      <Space h="lg" />

      <SimpleGrid cols={2}>
        {shlData.map((item: any, index: number) => {
          console.log(item);
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
      {/* <CardModal
     dataCopy={dataCopy}
     destinationSelectOptions={destinationSelectOptions}
      /> */}
    </PageWrapper>
  );
}

export default ManageShlContainer;
