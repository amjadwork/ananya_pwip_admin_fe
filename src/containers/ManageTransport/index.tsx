import React, { useEffect, useState } from "react";
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
import { Pencil, X, Check, Plus} from "tabler-icons-react";
import EditTransportForm from "../../forms/ManageTransport/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";

import APIRequest from "../../helper/api";

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

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const sourceSelectOptions = props.sourceSelectOptions;
  const originSelectOptions = props.originSelectOptions;
  const handleUpdateTransportUIData = props.handleUpdateTransportUIData;

  return (
    <EditTransportForm
      handleCloseModal={handleCloseModal}
      originSelectOptions={originSelectOptions}
      sourceSelectOptions={sourceSelectOptions}
      handleUpdateTransportUIData={handleUpdateTransportUIData}
    />
  );
};

function ManageTransportContainer() {
  const [activeFilter, setActiveFilter] = React.useState<any>(null);
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>("edit");
  const [transportData, setTransportData] = React.useState<any>([]);
  const [sourceSelectOptions, setSourceSelectOptions] = React.useState<any>([]);
  const [originSelectOptions, setOriginSelectOptions] = React.useState<any>([]);
  const [transportAPIPayload, setTransportAPIPayload] =
    React.useState<any>(null);
  const[ originListData , setOriginListData] = useState<any>([]);
  const[ sourceListData , setSourceListData] = useState<any>([]);


  // const [originCardData, setOriginCardData] = React.useState<any>([]);



  const handleRefetchTransportList = (transportPostResponse: any) => {
    if (transportPostResponse) {
      handleGetSource();
      handleGetOrigin();
      getTransportList();
    }
  };

  const getTransportList = async () => {
    const transportResponse: any = await APIRequest("transportation", "GET");
    if (transportResponse) {
      setTransportData(() => [...transportResponse]);
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

  const handleGetSource = async () => {
    const sourceResponse = await APIRequest(
      "location?filterType=source",
      "GET"
    );
    console.log("sourceResponse", sourceResponse[0])
    setSourceListData(sourceResponse[0].source)

    if (sourceResponse) {
      const sourceOptions = sourceResponse[0].source.map((d: any) => {
        return {
          label: d.region,
          value: d._id,
        };
      });
      setSourceSelectOptions(() => [...sourceOptions]);
      getTransportList();
    }
  }; 
   console.log("sourceListData", sourceListData);
   console.log("sourceSelectOption",sourceSelectOptions);

  
  const handleGetOrigin= async () => {
    const originResponse = await APIRequest(
      "location?filterType=origin",
      "GET"
    );
     console.log("originResponse", originResponse[0])
     setOriginListData(originResponse[0].origin)
    if (originResponse) {
      const regionOptions = originResponse[0].origin.map((d: any) => {
        return {
          label: d.portName,
          value: d._id,
        };
      });

      setOriginSelectOptions(() => [...regionOptions]);
      getTransportList();
    }
  };
  // console.log("originSelectOption",originSelectOptions);
  // console.log("transportData", transportData)

  // console.log('here ', transportData)


  const handleUpdateTransportUIData = (formData: any) => {
    // console.log(formData)
    setTransportAPIPayload({ ...formData });
  
    let chaArr: any = [...transportData];

    const arr = chaArr.map((d: any) => {
      if (d?._originPortId === formData?._originPortId) {
        return {
          ...d,
          sourceLocations: [...d.sourceLocations, ...formData.sourceLocations],
        };
      }
      return {
        ...d,
      };
    });

    setTransportData(() => [...arr]);
  };

  const handleSave = (bool: boolean) => {
    handleEditAction(bool);
  };

  const handleSaveAction = async () => {
    if(transportAPIPayload){
    const transportResponse = await APIRequest(
      "transportation",
      "POST",
      transportAPIPayload
    );
    if(transportResponse){
      handleGetSource();
      handleGetOrigin()
    }
  }
};
  useEffect(()=>{
    console.log("sourceListData",sourceListData)
  },[sourceListData])

  React.useEffect(() => {
    handleGetSource();
    handleGetOrigin();
  }, []);


  const compareArr = transportData.map((d: any) => d._originPortId);


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
          handleEditAction={handleSave}
          editModeActive={editModeActive}
          handleSaveAction={handleSaveAction}
        />
      )}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "edit"
          ? "Add Transportation Charges"
          : "Update Transportation Charges"
      }
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => {
        if (modalType === "edit") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: any) => setModalOpen(bool)}
              sourceSelectOptions={sourceSelectOptions}
              originSelectOptions={originSelectOptions}            
              handleUpdateTransportUIData={handleUpdateTransportUIData}
            />
          );
        }

        if (modalType === "update") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: any) => setModalOpen(bool)}
              originSelectOptions={originSelectOptions}
              sourceSelectOptions={sourceSelectOptions}
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
          <Title order={1}>Transportation Charges</Title>
          <Group spacing="md">
          <Input placeholder="Search" />
         {editModeActive && <Button
              type="submit"
              leftIcon={<Plus size={14} />}
              onClick={() => setModalOpen(true)}
            >
              Add
            </Button>}
            </Group>
        </Group>
      </Box>

      <Space h="lg" />

      <SimpleGrid cols={2}>
        {originListData.map((item: any, index: number) => {
          return (
            <SectionCard
              key={index}
              withBorder
              radius="md"
              p="lg"
              component="a"
            >
              <Title order={3}> {item?.portName} </Title>
              <Space h="xl" />
              <ScrollArea
                scrollbarSize={2}
                style={{ maxHeight: 380, height: 360 }}
              >
                {transportData?.map((originPortId: any) => {
                  if(originPortId._originPortId === item._id) {
                    return (
                      <List type="ordered" spacing="lg">
                  {originPortId?.sourceLocations?.map((d: any, i: number) =>{ 
                    console.log(d)
                    console.log(sourceListData)
                    return(
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
                      <List.Item style={{ fontWeight: "700" }}>
                      {sourceListData.find((sourceData:any)=>sourceData._id === d._sourcePortId
               )?.region} -{" "}
                        <span style={{ fontWeight: "800" }}>
                          INR {d.transportationCharge}
                        </span>
                      </List.Item>
                    </Box>
                  )})}
                </List>
                    )
                  }
                })}
              </ScrollArea>
            </SectionCard>
          );
        })}
      </SimpleGrid>
    </PageWrapper>
  );
}



export default ManageTransportContainer;
