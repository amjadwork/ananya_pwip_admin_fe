import React, { useState, useEffect } from "react";
import { Plus, Check, Download, Loader2 } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import PageWrapper from "../../components/Wrappers/PageWrapper";
import AddEditLocationFormContainer from "../../forms/Location/index";
import {
  getAllLocationData,
  postLocationData,
  deleteLocationData,
  patchLocationData,
  getDestinationData,
} from "../../services/export-costing/Locations";
import DataTable from "../../components/DataTable/DataTable";
import APIRequest from "../../helper/api";
import { Loader } from "@mantine/core";

const sourceColumns = [
  {
    label: "No.",
    key: "serialNo",
    width: "30px",
    fixed: true,
  },
  {
    label: "Source",
    key: "region",
    width: "200px",
    sortable: true,
  },
  {
    label: "State",
    key: "state",
    width: "200px",
    sortable: true,
  },
  {
    label: "Action",
    key: "action",
    width: "50px",
    sortable: false,
    fixed: true,
  },
];
const originColumns = [
  {
    label: "No.",
    key: "serialNo",
    width: "30px",
    fixed: true,
  },
  {
    label: "Port Code",
    key: "portCode",
    width: "70px",
  },
  {
    label: "Port Name",
    key: "portName",
    width: "100px",
    sortable: true,
  },
  {
    label: "CFS Station",
    key: "cfsStation",
    width: "100px",
  },
  {
    label: "City",
    key: "city",
    width: "100px",
  },
  {
    label: "State",
    key: "state",
    width: "100px",
  },
  {
    label: "Action",
    key: "action",
    width: "50px",
    sortable: false,
    fixed: true,
  },
];
const destinationColumns = [
  {
    label: "No.",
    key: "serialNo",
    width: "35px",
    fixed: true,
  },
  {
    label: "Port Code",
    key: "portCode",
    width: "70px",
  },
  {
    label: "Destination Port",
    key: "portName",
    width: "150px",
    sortable: true,
  },
  {
    label: "Country",
    key: "country",
    width: "150px",
  },
  {
    label: "Available Origin Port",
    key: "originPortName",
    width: "200px",
  },
  {
    label: "Action",
    key: "action",
    width: "60px",
    sortable: false,
    fixed: true,
  },
];
type Column = {
  label: string;
  key: string;
  sortable?: boolean;
};

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const handleSetLocationPayload = props.handleSetLocationPayload;
  const locationPayload = props.locationPayload;
  const updateFormData = props.updateFormData;
  const locationData = props.locationData;
  const selectedFilterValue = props.selectedFilterValue;
  const handlePictureChange = props.handlePictureChange;
  const modalType = props.modalType;
  const modalOpen = props.modalOpen;

  return (
    <AddEditLocationFormContainer
      handleCloseModal={handleCloseModal}
      handleSetLocationPayload={handleSetLocationPayload}
      locationPayload={locationPayload}
      updateFormData={updateFormData}
      locationData={locationData}
      selectedFilterValue={selectedFilterValue}
      modalType={modalType}
      handlePictureChange={handlePictureChange}
      modalOpen={modalOpen}
    />
  );
};

function LocationsContainer() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [downloadLoader, setDownloadLoader] = useState<any>(false);
  const [locationData, setLocationData] = useState<any>({
    source: [],
    origin: [],
    destination: [],
  });
  const [locationPayload, setLocationPayload] = useState<any>({
    source: [],
    origin: [],
    destination: [],
  });
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [selectedFilterValue, setSelectedFilterValue] = useState("source");

  const handleSelectRadioFilterChange = (value: any) => {
    setSelectedFilterValue(value);
  };
  const handleGetCombinationSheet = async () => {
    setDownloadLoader(true);
    await APIRequest("location/combination/getexcel", "GETEXCEL")
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `All_combination_data` + ".xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setDownloadLoader(false);
      })
      .catch((error) => {
        showNotification({
          title: "Something went wrong !",
          message: "please try again",
        });
        setDownloadLoader(false);
      });
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

  //to get all Location Data from database
  const handleGetLocation = async () => {
    const response = await getAllLocationData();
    const responseDestination = await getDestinationData();
    if (response) {
      setLocationData({
        source: response.source || [],
        origin: response.origin || [],
        destination: responseDestination.destination || [],
      });
    }
  };

  const handleSetLocationPayload = async (form: any) => {
    let data = { ...form };
    let payload: any = {};
    data.destination = data.destination.map((p: any) => {
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

    if (data?.source?.length) {
      payload = [...data.source];
    }

    if (data?.origin?.length) {
      payload = [...data.origin];
    }

    if (data?.destination?.length) {
      payload = [...data.destination];
    }

    handleSaveAction(payload); //API post request to database

    const obj: any = {
      source: [...locationData.source, ...data.source],
      origin: [...locationData.origin, ...data.origin],
      destination: [...locationData.destination, ...data.destination],
    };

    setLocationData(obj);
  };

  //to add new location data row in the table
  const handleSaveAction = async (data: any) => {
    if (data[0] && modalType === "add") {
      const response = await postLocationData(data[0], selectedFilterValue);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Location added successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }
    if (data[0] && modalType === "update") {
      const response = await patchLocationData(data[0], selectedFilterValue);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Location Data Updated!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }
  };

  //to delete the location data of particular row in table
  const openDeleteModal = (rowData: any) =>
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
      onConfirm: () => handleDelete(rowData),
    });

  const handleDelete = async (data: any) => {
    const response = await deleteLocationData(data, selectedFilterValue);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Location deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleGenerateSignedUrl = (
    e: any,
    name: any,
    ext: any,
    form: any,
    locationType: any
  ) => {
    const portName = form.portName.replace(/\s+/g, "_");
    const FileName = name.replace(/\s+/g, "_");
    const directory = `location/${locationType}/${portName}/`; // Constructing the directory parameter
    const c = APIRequest(
      `generate-signed-url?fileName=${FileName}&extension=${ext}&mediaType=image&directory=${directory}`,
      "GET"
    )
      .then((res: any) => {
        if (res) {
          const uri = res.url;
          const path = res.key;
          const fileSrc = e;
          const imageObject = {
            uri,
            fileSrc,
            path,
          };
          console.log(res, "res");
          return imageObject;
        }
      })
      .catch((error: any) => {
        console.error("Error fetching signed URL:", error);
        // Handle the error as needed
      });
    return c;
  };

  const handlePictureChange = async (e: any, form: any, locationType: any) => {
    const file = e;
    const extString = file.type;
    const extStringArr = extString.split("/");
    const ext = extStringArr[1];
    const name = `${Math.floor(Date.now() / 1000)}`;
    const result = await handleGenerateSignedUrl(
      e,
      name,
      ext,
      form,
      locationType
    );
    return result;
  };

  const handleRefreshCalls = () => {
    handleGetLocation();
  };

  React.useEffect(() => {
    handleGetLocation();
  }, [selectedFilterValue]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add a location" : "Update selected location"
      }
      onModalClose={() => {
        setModalOpen(false);
        setUpdateFormData(null);
      }}
      ModalContent={() => (
        <RenderModalContent
          handleCloseModal={(bool: boolean) =>
            bool ? setModalOpen(bool) : setModalOpen(false)
          }
          handleSetLocationPayload={handleSetLocationPayload}
          locationPayload={locationPayload}
          updateFormData={updateFormData}
          locationData={locationData}
          modalType={modalType}
          modalOpen={modalOpen}
          selectedFilterValue={selectedFilterValue}
          handlePictureChange={handlePictureChange}
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
          {
            label: `${downloadLoader ? "Processing" : "Get combination sheet"}`, //,
            icon: downloadLoader ? Loader2 : Download,
            color: "gray",
            type: "button",
            onClickAction: () => {
              if (!downloadLoader) {
                handleGetCombinationSheet();
              } else {
                alert("processing ..... ");
              }
            },
          },
        ]}
        handleRowEdit={(row: any, index: number) => {
          setModalType("update");
          let obj = { ...row };
          let formObj = {};

          if (selectedFilterValue === "source") {
            formObj = {
              _id: obj._id,
              region: obj.region,
              state: obj.state,
            };
          }
          if (selectedFilterValue === "origin") {
            formObj = {
              _id: obj._id,
              cfsStation: obj.cfsStation,
              city: obj.city,
              portName: obj.portName,
              state: obj.state,
              portCode: obj.portCode,
              imageUrl: obj.imageUrl || null,
            };
          }
          if (selectedFilterValue === "destination") {
            formObj = {
              portName: obj.portName,
              imageUrl: obj.imageUrl || null,
              portCode: obj.portCode,
              country: obj.country,
              _id: obj._id,
              linkedOrigin: obj?.linkedOrigin,
            };
          }

          setUpdateFormData(formObj);
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
