import React from "react";
import {
  Box,
  ActionIcon,
  Group,
  Popover,
  Text,
  Space,
  Title,
  List,
  ScrollArea,
} from "@mantine/core";
import { Pencil, X, Check, Plus } from "tabler-icons-react";
import { Card as SectionCard, Button} from "../../components/index";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";
import EditLocationFormContainer from "../../forms/Location/index";

import APIRequest from "./../../helper/api";

const RenderPageHeader = (props: any) => {
  return <PageHeader title="Manage Locations" />;
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
          onClick={() => handleEdit(false)}
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
              <Button size="xs" color="gray" onClick={() => handleEdit(false)}>
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
      onClick={() => handleEdit(true)}
    >
      <Pencil size={16} />
    </ActionIcon>
  );
};

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const handleSettingLocationData = props.handleSettingLocationData;
  const locationPayload = props.locationPayload;
  const locationData = props.locationData;

  return (
    <EditLocationFormContainer
      handleCloseModal={handleCloseModal}
      handleSettingLocationData={handleSettingLocationData}
      locationPayload={locationPayload}
      locationData={locationData}
    />
  );
};

function LocationsContainer() {
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState(false);
  const [locationData, setLocationData] = React.useState<any>({
    source: [],
    origin: [],
    destination: [],
  });
  const [locationPayload, setLocationPayload] = React.useState<any>({
    source: [],
    origin: [],
    destination: [],
  });

  const handleEdit = (bool: boolean) => {
    setEditModeActive(bool);
  };

  const handleSaveAction = () => {
    let payload: any = {};

    if (locationPayload?.source?.length) {
      payload.source = locationPayload.source;
    }

    if (locationPayload?.origin?.length) {
      payload.origin = locationPayload.origin;
    }

    if (locationPayload?.destination?.length) {
      payload.destination = locationPayload.destination;
    }

    submitLocation(payload);
  };

  const submitLocation = async (payload: any) => {
    const addLocationResponse: any = await APIRequest(
      "location",
      "POST",
      payload
    );

    if (addLocationResponse) {
      getLocations();
    }
  };

  const getLocations = async () => {
    const locationResponse: any = await APIRequest("location", "GET");

    if (locationResponse) {
      setLocationData({
        source: locationResponse[0].source || [],
        origin: locationResponse[0].origin || [],
        destination: locationResponse[0].destination || [],
      });
    }
  };

  React.useEffect(() => {
    getLocations();
  }, []);

  return (
    <PageWrapper
      PageHeader={() => <RenderPageHeader />}
      PageAction={() => (
        <RenderPageAction
          handleActionClick={() => setModalOpen(true)}
          handleEdit={handleEdit}
          editModeActive={editModeActive}
          handleSaveAction={handleSaveAction}
        />
      )}
      modalOpen={modalOpen}
      modalTitle="Add a location"
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => (
        <RenderModalContent
          handleCloseModal={(bool: boolean) => setModalOpen(bool)}
          handleSettingLocationData={(data: any) => {
            let payload = {...data};

            payload.destination = payload.destination.map((p: any) => {
              const linkedOrigin = [...p.linkedOrigin];
              const newLinkedOrigin = locationData.origin.filter((o: any) => {
                if(linkedOrigin.includes(o._id)) {
                  return o
                }
              }).map((o: any) => {
                return {
                  originPortName: o.portName,
                  _originId: o._id
                }
              })

              return {
                ...p,
                linkedOrigin: [...newLinkedOrigin]
              }
            })
            setLocationPayload(payload);

            const obj: any = {
              source: [...locationData.source, ...payload.source],
              origin: [...locationData.origin, ...payload.origin],
              destination: [...locationData.destination, ...payload.destination],
            };
            
            setLocationData(obj);
          }}
          locationPayload={locationPayload}
          locationData={locationData}
        />
      )}
      modalSize="40%"
    >
      <div style={{ width: "100%", height: "auto" }}>
        <Group spacing="md" grow>
          {Object.keys(locationData).map((locationType: any, index: number) => {
            return (
              <SectionCard
                key={index}
                withBorder
                radius="md"
                p="lg"
                component="a"
              >
                <Group position="apart">
                  <Title order={3}>{locationType}</Title>

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
                    {locationData[locationType].map((d: any, i: number) => (
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
                          {locationType === "source"
                            ? d.region
                            : locationType === "origin"
                            ? d.portName
                            : d.portName}
                          <Text
                            size="sm"
                            sx={(theme) => ({
                              color: theme.colors.dark[1],
                            })}
                          >
                            {locationType === "source"
                              ? d.state
                              : locationType === "origin"
                              ? d.state
                              : d.country}
                          </Text>
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

export default LocationsContainer;
