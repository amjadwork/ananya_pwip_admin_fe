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
  const regionSelectOptions = props.regionSelectOptions;
  const handleUpdateTransportUIData = props.handleUpdateTransportUIData;

  return (
    <EditTransportForm
      handleCloseModal={handleCloseModal}
      regionSelectOptions={regionSelectOptions}
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
  const [regionSelectOptions, setRegionSelectOptions] = React.useState<any>([]);
  const [transportAPIPayload, setTransportAPIPayload] =
    React.useState<any>(null);

  const handleRefetchTransportList = (transportPostResponse: any) => {
    if (transportPostResponse) {
      handleGetSource();
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
    if (sourceResponse) {
      const formattedsource = sourceResponse[0].source.map((d: any) => {
        return {
          name: d.region,
          _sourcePortId: d._id,
          list: [],
        };
      });

      const sourceOptions = sourceResponse[0].source.map((d: any) => {
        return {
          label: d.region,
          value: d._id,
        };
      });
      setSourceSelectOptions(() => [...sourceOptions]);
      getTransportList();
    }

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
      getTransportList();
    }
  };
 
  


  const handleUpdateTransportUIData = (formData: any) => {
    setTransportAPIPayload({ ...formData });
    let chaArr: any = [...transportData];

    chaArr = chaArr.map((d: any) => {
      if (formData._sourcePortId === d._sourcePortId) {
        return {
          ...d,
          sourceLocations: [...d.sourceLocations, ...formData.sourceLocations],
        };
      }
      return {
        ...d,
      };
    });

    setTransportData(() => [...chaArr]);
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
      handleGetSource()
    }
  }
};

const[ originListData , setOriginListData] = useState<any>([])

const getOrginList = async () => {
  const regionResponse = await APIRequest(
    "location?filterType=origin",
    "GET"
  );
  // console.log(regionResponse[0])
  setOriginListData(regionResponse[0].origin)
  
};
   useEffect(()=>{
    // console.log(transportData)
    getOrginList()
   },[transportData])
   
   useEffect(()=>{
    console.log(originListData)
    
   },[originListData])


  React.useEffect(() => {
    handleGetSource();
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
              regionSelectOptions={regionSelectOptions}            
              handleUpdateTransportUIData={handleUpdateTransportUIData}
            />
          );
        }

        if (modalType === "update") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: any) => setModalOpen(bool)}
              regionSelectOptions={regionSelectOptions}
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
        {transportData.map((item: any, index: number) => {
          console.log("item",item._originPortId)
          console.log(originListData)
          // const x =
          // {
          //   console.log("originPort")
          //   if(originPort._id === item._originPortId){
          //     return(originPort.portName)
          //     // return(originPort)
      
          //   }
          // }
          // )
          // console.log(x)
          
          return (
            <SectionCard
              key={index}
              withBorder
              radius="md"
              p="lg"
              component="a"
            >
              <Title order={3}>{originListData.find((originPort:any)=>originPort._id === item._originPortId
               )?.portName}

              </Title>
              <Space h="xl" />
              <ScrollArea
                scrollbarSize={2}
                style={{ maxHeight: 380, height: 360 }}
              >
                <List type="ordered" spacing="lg">
                  {item?.sourceLocations?.map((d: any, i: number) => (
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
                        {d._sourcePortId} -{" "}
                        <span style={{ fontWeight: "800" }}>
                          INR {d.transportationCharge}
                        </span>
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
