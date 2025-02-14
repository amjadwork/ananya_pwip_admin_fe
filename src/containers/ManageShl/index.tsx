import React, { useEffect, useState } from "react";
import { Check } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditShlForm from "../../forms/ManageShl/index";
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
  getShlData,
  postShlData,
  deleteShlData,
  patchShlData,
} from "../../services/export-costing/SHL";
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
    Header: "Origin Port",
    accessor: "origin",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Destination Port",
    accessor: "destination",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "SHL Charge",
    accessor: "shlCharge",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "THC",
    accessor: "thc",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "B/LFee",
    accessor: "blFee",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Surrender",
    accessor: "surrender",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "MUC",
    accessor: "muc",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Convenience",
    accessor: "convenienceFee",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Seal",
    accessor: "seal",
    width: "200px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "90px",
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
    <EditShlForm
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

function ManageShlContainer() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [shlData, setShlData] = useState<any>([]);
  const [originSelectOptions, setOriginSelectOptions] = useState<any>([]);
  const [containerSelectOptions, setContainerSelectOptions] = useState<any>([]);
  const [destinationSelectOptions, setDestinationSelectOptions] = useState<any>(
    []
  );
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);
  const containerType: any = "shl";

  //to get SHL Data from database
  const handleGetShl = async (list: any) => {
    const response: any = await getShlData();
    try {
      if (response) {
        let array: any = list?.map((item: any) => {
          let destinationArr: any = [];
          let originIdStringArr: any = [];

          response.forEach((origin: any) => {
            if (item._originId === origin._originPortId) {
              destinationArr.push(origin.destinations);
              originIdStringArr.push(origin._originId);
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
    } catch (error) {
      console.log(error);
    }
  };

  //to get Origin Data from database
  const handleGetOrigin = async () => {
    const response = await getOriginData();
    if (response) {
      const originList = response.origin.map((d: any) => {
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
      handleGetShl(originList);
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

  //to get Destination by Origin ID from DB
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
      const response = await postShlData(data);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "SHL Charges Added!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (data && modalType === "update") {
      const response = await patchShlData(data);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "SHL Charges Updated!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }
  };

  //to delete a single row data
  const openDeleteModal = (rowData: any) =>
    openConfirmModal({
      title: "Delete the SHL Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the SHL Data?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete SHL Data", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });
  const handleDeleteRow = async (data: any) => {
    const response = await deleteShlData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "SHL Charges Deleted!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetOrigin();
  };

  useEffect(() => {
    handleGetOrigin();
  }, []);

  useEffect(() => {
    if (shlData.length && destinationSelectOptions.length) {
      const tableData = shlData.flatMap((d: any) => {
        return d.list.map((l: any) => {
          const destination = destinationSelectOptions.find(
            (option: any) => option.value === l._destinationPortId
          );

          return {
            ...l,
            origin: d.name,
            destination: destination ? destination.label : "Null",
            _originPortId: d._originId,
          };
        });
      });
      setTableRowData(tableData);
    }
  }, [shlData, destinationSelectOptions]);

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
          ? "Add SHL Charges"
          : modalType === "upload"
            ? "Update Or Add Data by Excel Sheet"
            : "Update SHL Charges"
      }
      onModalClose={() => {
        setModalOpen(false);
        setUpdateFormData(null);
      }}
      ModalContent={() => {
        return (
          <RenderModalContent
            handleCloseModal={(bool: boolean) => setModalOpen(bool)}
            originSelectOptions={originSelectOptions}
            handleSaveAction={handleSaveAction}
            handleGetDestinationDataByOrigin={handleGetDestinationDataByOrigin}
            containerSelectOptions={containerSelectOptions}
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
                  shlCharge: obj.shlCharge,
                  thc: obj.thc,
                  blFee: obj.blFee,
                  surrender: obj.surrender,
                  convenienceFee: obj.convenienceFee,
                  muc: obj.muc,
                  seal: obj.seal,
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

export default ManageShlContainer;
