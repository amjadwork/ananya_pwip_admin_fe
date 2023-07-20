import React, { useEffect } from "react";
import { Plus } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import AddEditLocationFormContainer from "../../forms/Location/index";
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
    label: "Action",
    key: "action",
    sortable: false,
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
    label: "Action",
    key: "action",
    sortable: false,
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
    label: "Available Origin Port",
    key: "originPortName",
  },
  {
    label: "Action",
    key: "action",
    sortable: false,
  },
];

type Column = {
  label: string;
  key: string;
  sortable?: boolean;
};

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const handleSettingLocationData = props.handleSettingLocationData;
  const locationPayload = props.locationPayload;
  const locationData = props.locationData;
  const selectedFilterValue = props.selectedFilterValue;

  return (
    <AddEditLocationFormContainer
      handleCloseModal={handleCloseModal}
      handleSettingLocationData={handleSettingLocationData}
      locationPayload={locationPayload}
      locationData={locationData}
      selectedFilterValue={selectedFilterValue}
    />
  );
};

function LocationsContainer() {
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [modalType, setModalType] = React.useState<string>("add");
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
  const [selectedFilterValue, setSelectedFilterValue] =
    React.useState("source");

  const handleSelectRadioFilterChange = (value: any) => {
    setSelectedFilterValue(value);
  };

  let tableRowData: any[] = [];
  let tableColumns: Column[] = [];

  if (selectedFilterValue === "source") {
    tableRowData = locationData.source;
    tableColumns = sourceColumns;
  } else if (selectedFilterValue === "origin") {
    tableRowData = locationData.origin;
    tableColumns = originColumns;
  } else if (selectedFilterValue === "destination") {
    tableRowData = locationData.destination;
    tableColumns = destinationColumns;
  }

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
          Are you sure you want to delete this location record? Note:This action
          is destructive and you will have to contact support to restore your
          data.
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
        source: locationResponse.source || [],
        origin: locationResponse.origin || [],
        destination: locationResponse.destination || [],
      });
    }
  };

  React.useEffect(() => {
    getLocations();
  }, []);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add a location" : "Update selected location"
      }
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
          selectedFilterValue={selectedFilterValue}
        />
      )}
      modalSize="40%"
    >
      <DataTable
        data={tableRowData}
        columns={tableColumns}
        actionItems={[
          {
            label: "Add",
            icon: Plus,
            color: "gray",
            type: "button",
            onClickAction: () => {
              setModalType("add");
              setModalOpen(true);
            },
          },
        ]}
        handleRowEdit={(row: any, rowIndex: number) => {
          setModalType("update");
          setModalOpen(true);
        }}
        handleRowDelete={(row: any, rowIndex: number) => {
          openDeleteModal(row);
        }}
        selectFilterTypes={[
          {
            type: "radio-group",
            label: "Location type",
            name: "locationTyoe",
            placeholder: "eg. Origin",
            options: [
              { value: "source", label: "Source" },
              { value: "origin", label: "Origin" },
              { value: "destination", label: "Destination" },
            ],
          },
        ]}
        selectedFilterValue={selectedFilterValue}
        handleSelectRadioFilterChange={handleSelectRadioFilterChange}
      />
    </PageWrapper>
  );
}

export default LocationsContainer;
