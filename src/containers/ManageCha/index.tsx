import React, { useEffect, useState } from "react";
import { Plus, Check, Upload } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditChaForm from "../../forms/ManageCha/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";
import SheetUpload from "../../components/SheetUpload/SheetUpload";
import { getContainerData } from "../../services/export-costing/Container";
import {
  getDestinationDataByOrigin,
  getDestinationData,
  getOriginData,
} from "../../services/export-costing/Locations";
import {
  getChaData,
  postChaData,
  deleteChaData,
  patchChaData,
} from "../../services/export-costing/CHA";

const columns = [
  {
    label: "Origin",
    key: "originPort",
    width: "170px",
    sortable: true,
  },
  {
    label: "Destination",
    key: "destinationPort",
    width: "170px",
    sortable: true,
  },
  {
    label: "CHA",
    key: "chaCharge",
    width: "80px",
  },
  {
    label: "Silica Gel",
    key: "silicaGel",
    width: "70px",
  },
  {
    label: "Craft Paper",
    key: "craftPaper",
    width: "70px",
  },
  {
    label: "Transport Charge",
    key: "transportCharge",
    width: "90px",
  },
  {
    label: "Custom Charge",
    key: "customCharge",
    width: "80px",
  },
  {
    label: "Loading Charge",
    key: "loadingCharge",
    width: "80px",
  },
  {
    label: "Service Charge",
    key: "serviceCharge",
    width: "80px",
  },
  {
    label: "Fumigation Charge",
    key: "fumigationCharge",
    width: "100px",
  },
  {
    label: "PQC Charge",
    key: "pqc",
    width: "80px",
  },
  {
    label: "COO Charge",
    key: "coo",
    width: "80px",
  },
  {
    label: "Action",
    key: "action",
    width: "100px",
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const originSelectOptions = props.originSelectOptions;
  const containerSelectOptions = props.containerSelectOptions;
  const handleGetDestinationDataByOrigin =
    props.handleGetDestinationDataByOrigin;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const modalType = props.modalType;
  const containerType = props.containerType;

  if (modalType === "upload") {
    return <SheetUpload containerType={containerType} />;
  }

  return (
    <EditChaForm
      handleCloseModal={handleCloseModal}
      originSelectOptions={originSelectOptions}
      containerSelectOptions={containerSelectOptions}
      handleGetDestinationDataByOrigin={handleGetDestinationDataByOrigin}
      handleSaveAction={handleSaveAction}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageChaContainer() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [chaData, setChaData] = useState<any>([]);
  const [originSelectOptions, setOriginSelectOptions] = useState<any>([]);
  const [destinationSelectOptions, setDestinationSelectOptions] = useState<any>(
    []
  );
  const [containerSelectOptions, setContainerSelectOptions] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [selectedChaData, setSelectedChaData] = React.useState<any>(null);

  const [tableRowData, setTableRowData] = useState<any>([]);
  const containerType: any = "cha";

  //to get CHA Data from database
  const handleGetCha = async (data: any = []) => {
    const response: any = await getChaData();
    try {
      if (response) {
        let array: any = data?.map((item: any) => {
          let destinationArr: any = [];
          let originIdStringArr: any = [];

          response.forEach((region: any) => {
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

        setChaData(() => [...array]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetOriginData = async () => {
    const response = await getOriginData();
    if (response) {
      const formattedOrigin = response.origin.map((d: any) => {
        return {
          name: d.portName,
          _originId: d._id,
          list: [],
        };
      });

      const originOptions = response.origin.map((d: any) => {
        return {
          label: d.portName,
          value: d._id,
        };
      });

      setOriginSelectOptions(() => [...originOptions]);

      handleGetDestination();
      handleGetContainer();
      handleGetCha(formattedOrigin);
    }
  };

  //to get Destination Data from database
  const handleGetDestination = async () => {
    const response = await getDestinationData();

    if (response) {
      const destinationOptions = response.destination.map((d: any) => {
        return {
          label: d.portName,
          value: d._id,
        };
      });
      setDestinationSelectOptions(() => [...destinationOptions]);
    }
  };

  const handleGetDestinationDataByOrigin = async (originPortId: any) => {
    try {
      const response = await getDestinationDataByOrigin(originPortId);
      return response.destination.map((d: any) => ({
        label: d.portName,
        value: d._id,
      }));
    } catch (error) {
      console.error("Error fetching destination data:", error);
      return [];
    }
  };

  //to get Container Data from database
  const handleGetContainer = async () => {
    const response = await getContainerData();

    if (response) {
      const containerOptions = response.map((d: any) => {
        return {
          label: `${d.type} - ${d.size} - ${d.weight}${d.unit}`,
          value: d._id,
        };
      });
      setContainerSelectOptions(() => [...containerOptions]);
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    if (data && modalType === "add") {
      const response = await postChaData(data);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "CHA Charges Added!",
          message: "",
          autoClose: 4000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (data && modalType === "update") {
      const response = await patchChaData(data);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "CHA Charges Updated!",
          message: "",
          autoClose: 4000,
          icon: <Check />,
          color: "green",
        });
      }
    }
  };

  //to delete a single row data
  const openDeleteModal = (rowData: any) =>
    openConfirmModal({
      title: "Delete the CHA Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the CHA Data?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete CHA Data", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });
  const handleDeleteRow = async (data: any) => {
    const response = await deleteChaData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "CHA Charges Deleted!",
        message: "",
        autoClose: 4000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetOriginData();
  };

  React.useEffect(() => {
    handleGetOriginData();
  }, []);

  useEffect(() => {
    if (chaData.length && destinationSelectOptions.length) {
      const tableData = chaData.flatMap((d: any) => {
        return d.list.map((l: any) => {
          const destination = destinationSelectOptions.find(
            (option: any) => option.value === l._destinationPortId
          );
          return {
            ...l,
            originPort: d.name,
            destinationPort: destination ? destination.label : "Null",
            _originPortId: d._originId,
          };
        });
      });
      setTableRowData(tableData);
    }
  }, [chaData, destinationSelectOptions]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add"
          ? "Add CHA Charges"
          : modalType === "upload"
          ? "Update Or Add Data by Excel Sheet"
          : "Update CHA CHarges"
      }
      onModalClose={() => {
        setModalOpen(false);
        setSelectedChaData(null);
        setUpdateFormData(null);
      }}
      ModalContent={() => {
        return (
          <RenderModalContent
            handleCloseModal={(bool: boolean) => setModalOpen(bool)}
            originSelectOptions={originSelectOptions}
            handleSaveAction={handleSaveAction}
            containerSelectOptions={containerSelectOptions}
            handleGetDestinationDataByOrigin={handleGetDestinationDataByOrigin}
            updateFormData={updateFormData}
            modalType={modalType}
            modalOpen={modalOpen}
            containerType={containerType}
          />
        );
      }}
      modalSize="70%"
    >
      <DataTable
        data={tableRowData}
        columns={columns}
        actionItems={[
          {
            label: "Upload",
            icon: Upload,
            color: "gray",
            type: "button",
            onClickAction: () => {
              setModalType("upload");
              setModalOpen(true);
            },
          },
          {
            label: "Add",
            icon: Plus,
            color: "gray",
            type: "button",
            onClickAction: () => {
              setModalOpen(true);
              setModalType("add");
            },
          },
        ]}
        handleRowEdit={(row: any, index: number) => {
          let obj = { ...row };

          const formObj = {
            _originPortId: obj._originPortId,
            _id: obj._id,
            destinations: [
              {
                _destinationPortId: obj._destinationPortId,
                _containerId: obj._containerId,
                chaCharge: obj.chaCharge,
                silicaGel: obj.silicaGel,
                craftPaper: obj.craftPaper,
                transportCharge: obj.transportCharge,
                loadingCharge: obj.loadingCharge,
                customCharge: obj.customCharge,
                serviceCharge: obj.serviceCharge,
                fumigationCharge: obj.fumigationCharge,
                pqc: obj.pqc,
                coo: obj.coo,
              },
            ],
          };

          setUpdateFormData(formObj);
          setModalType("update");
          setModalOpen(true);
        }}
        handleRowDelete={(row: any) => {
          openDeleteModal(row);
        }}
      />
    </PageWrapper>
  );
}

export default ManageChaContainer;
