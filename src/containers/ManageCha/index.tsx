import React, { useEffect, useState } from "react";
import { Check } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditChaForm from "../../forms/ManageCha/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import ReactTable from "../../components/ReactTable/ReactTable";
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
import {
  hasEditPermission,
  hasAddNewPermission,
  hasDeletePermission,
} from "../../helper/helper";

const columns = [
  {
    Header: "No.",
    accessor: "serialNo",
    width: "80px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
  },
  {
    Header: "Origin",
    accessor: "originPort",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Destination",
    accessor: "destinationPort",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "CHA Charge",
    accessor: "chaCharge",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Silica Gel",
    accessor: "silicaGel",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Craft Paper",
    accessor: "craftPaper",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Transport",
    accessor: "transportCharge",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Custom",
    accessor: "customCharge",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Loading",
    accessor: "loadingCharge",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Service",
    accessor: "serviceCharge",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Fumigation",
    accessor: "fumigationCharge",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "PQC ",
    accessor: "pqc",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "COO ",
    accessor: "coo",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "100px",
    sortable: false,
    fixed: true,
    disableFilters: true,
    filterable: false,
    showCheckbox: false,
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

    const actionButtons = [
      {
        label: "Upload Excel Sheet",
        color: "gray",
        type: "button",
        onClickAction: () => {
          setModalType("upload");
          setModalOpen(true);
        },
      },
      {
        label: "Add New",
        color: "gray",
        type: "button",
        onClickAction: () => {
          setModalOpen(true);
          setModalType("add");
        },
      },
    ];

    const conditionalActionButtons = hasAddNewPermission()
      ? actionButtons
      : actionButtons.slice(0, 1);
  

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
      <ReactTable
        data={tableRowData}
        columns={columns}
        actionButtons={conditionalActionButtons}
        onEditRow={(row: any, index: any) => {
          if (hasEditPermission()) {
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
          }
        }}
        onDeleteRow={
          hasDeletePermission()
            ? (rowData: any) => {
                openDeleteModal(rowData);
              }
            : undefined
        }
      />
    </PageWrapper>
  );
}

export default ManageChaContainer;
