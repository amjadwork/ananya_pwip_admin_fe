import React, { useEffect } from "react";
import { Tabs, Group, Popover, Space } from "@mantine/core";
import { Pencil, X, Check, Plus } from "tabler-icons-react";
import {
  Button,
  ActionIcon,
  Text,
} from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import PageHeader from "../../components/PageHeader/PageHeader";
import EditLocationFormContainer from "../../forms/Location/index";
import {
  getLocationData,
  submitLocationData,
} from "../../services/export-costing/Locations";
import DataTable from "../../components/DataTable/DataTable";

const sourceColumns = [
  {
    label: "Source",
    key: "region",
    sortable: true,
  },
  {
    label: "State",
    key: "state",
    sortable: true,
  },
  {
    label: "Actions",
    key: "action",
  },
];
const originColumns = [
  {
    label: "Port Name",
    key: "portName",
    sortable: true,
  },
  {
    label: "CFS Station",
    key: "cfsStation",
  },
  {
    label: "City",
    key: "city",
  },
  {
    label: "State",
    key: "state",
  },
  {
    label: "Actions",
    key: "action",
  },
];

const destinationColumns = [
  {
    label: "Destination Port",
    key: "portName",
    sortable: true,
  },
  {
    label: "Country",
    key: "country",
  },
  {
    label: "Origin Port",
    key: "originPortName",
  },
  {
    label: "Actions",
    key: "action",
  },
];

type Column = {
  label: string;
  key: string;
  sortable?: boolean;
};

type TabsProps = {
  defaultValue: string;
  active: string;
  onTabChange: (value: string) => void;
};

const RenderPageHeader = (props: any) => {
  return <PageHeader />;
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
          onClick={() => handleEdit(false)}>
          <X size={16} />
        </ActionIcon>

        <Popover
          width={250}
          trapFocus
          position="bottom-end"
          withArrow
          shadow="lg">
          <Popover.Target>
            <ActionIcon
              variant="filled"
              color="blue"
              sx={{
                "&[data-disabled]": { opacity: 0.4 },
              }}>
              <Check size={16} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown
            sx={(theme: any) => ({
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.white,
            })}>
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
                }}>
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
      onClick={() => handleEdit(true)}>
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
  const [selectedTab, setSelectedTab] = React.useState("source");

  const handleTabChange = (value: any) => {
    setSelectedTab(value);
  };
  let tabData: any[] = [];
  let tabColumns: Column[] = [];

  if (selectedTab === "source") {
    tabData = locationData.source;
    tabColumns = sourceColumns;
  } else if (selectedTab === "origin") {
    tabData = locationData.origin;
    tabColumns = originColumns;
  } else if (selectedTab === "destination") {
    // tabData = locationData.destination.flatMap((d: any) =>
    //   d.linkedOrigin.map((l: any) => ({
    //     portName: d.portName,
    //     country: d.country,
    //     originPortName: l.originPortName,
    //     _originId: l._originId,
    //   }))
    // );
    tabData = locationData.destination;
    tabColumns = destinationColumns;
  }

  const handleEdit = (bool: boolean) => {
    setEditModeActive(bool);
  };

  const handleSaveAction = async () => {
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

    const addLocationResponse = await submitLocationData(payload);

    if (addLocationResponse) {
      getLocations();
    }
  };

  const openDeleteModal = (data: any) =>
    openConfirmModal({
      title: "Delete Location",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this location record?
          <Text c="red">
            Note:This action is destructive and you will have to contact support
            to restore your data.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete Location", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => console.log("Confirmed"),
    });

  const getLocations = async () => {
    const locationResponse = await getLocationData();
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
            let payload = { ...data };

            payload.destination = payload.destination.map((p: any) => {
              const linkedOrigin = [...p.linkedOrigin];
              const newLinkedOrigin = locationData.origin
                .filter((o: any) => {
                  if (linkedOrigin.includes(o._id)) {
                    return o;
                  }
                })
                .map((o: any) => {
                  return {
                    originPortName: o.portName,
                    _originId: o._id,
                  };
                });

              return {
                ...p,
                linkedOrigin: [...newLinkedOrigin],
              };
            });
            setLocationPayload(payload);

            const obj: any = {
              source: [...locationData.source, ...payload.source],
              origin: [...locationData.origin, ...payload.origin],
              destination: [
                ...locationData.destination,
                ...payload.destination,
              ],
            };

            setLocationData(obj);
          }}
          locationPayload={locationPayload}
          locationData={locationData}
        />
      )}
      modalSize="40%">
      <Tabs
        {...({
          defaultValue: "source",
          active: selectedTab,
          onTabChange: handleTabChange,
        } as TabsProps)}>
        <Tabs.List grow position="center">
          <Tabs.Tab value="source">SOURCE</Tabs.Tab>
          <Tabs.Tab value="origin">ORIGIN</Tabs.Tab>
          <Tabs.Tab value="destination">DESTINATION</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={selectedTab} pt="xs">
          <DataTable
            data={tabData}
            columns={tabColumns}
            actionItems={[
              {
                label: "Add",
                icon: Plus,
                color: "gray",
                type: "button",
                onClickAction: () => {
                  // setModalType("add");
                  setModalOpen(true);
                },
              },
            ]}
            // handleRowEdit={(row: any, rowIndex: number) => {
            //   let obj = { ...row };
            //   delete obj["updatedAt"];
            //   delete obj["_id"];
            //   delete obj["_originPortId"];
            //   delete obj["createdAt"];
            //   delete obj["originPort"];

            //   const formObj = {
            //     _originPortId: row._originPortId,
            //     destinations: [obj],
            //   };

            //   setUpdateFormData(formObj);
            //   setModalType("update");
            //   setModalOpen(true);
            // }}
            handleRowDelete={(row: any, rowIndex: number) => {
              openDeleteModal(row);
            }}
          />
        </Tabs.Panel>
      </Tabs>
    </PageWrapper>
  );
}

export default LocationsContainer;
