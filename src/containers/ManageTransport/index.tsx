import React, { useEffect, useState } from "react";
import { Plus, Check, Upload } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditTransportationForm from "../../forms/ManageTransport/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";
import SheetUpload from "../../components/SheetUpload/SheetUpload";

import {
  getOriginData,
  getSourceData,
  getTransportationData,
  postTransportationData,
  deleteTransportationData,
  patchTransportationData,
} from "../../services/export-costing/Transport";

const columns = [
  {
    label: "No.",
    key: "serialNo",
    width: "35px",
    fixed: true,
  },
  {
    label: "Origin",
    key: "origin",
    width: "130px",
  },
  {
    label: "Source",
    key: "source",
    width: "130px",
  },
  {
    label: "Transportation Charge",
    key: "transportationCharge",
    width: "150px",
  },
  {
    label: "Action",
    key: "action",
    width: "50px",
    fixed: true,
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const originSelectOptions = props.originSelectOptions;
  const sourceSelectOptions = props.sourceSelectOptions;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const modalType = props.modalType;
  const containerType = props.containerType;

  if (modalType === "upload") {
    return <SheetUpload containerType={containerType} />;
  }

  return (
    <EditTransportationForm
      handleCloseModal={handleCloseModal}
      originSelectOptions={originSelectOptions}
      sourceSelectOptions={sourceSelectOptions}
      handleSaveAction={handleSaveAction}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageTransportContainer() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [transportationData, setTransportationData] = useState<any>([]);
  const [originSelectOptions, setOriginSelectOptions] = useState<any>([]);
  const [sourceSelectOptions, setSourceSelectOptions] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);
  const containerType: any = "transportation";

  //to get Transportation Data from database
  const handleGetTransportation = async () => {
    const response: any[] = await getTransportationData();

    try {
      if (response) {
        let array: any[] = response.map((item: any) => {
          let destinationArr: any[] = [];
          let originIdStringArr: string[] = [];

          response.forEach((origin: any) => {
            if (item._originPortId === origin._originPortId) {
              destinationArr.push(origin.sourceLocations);
              originIdStringArr.push(origin._id);
            }
          });

          return {
            ...item,
            list: originIdStringArr.includes(item._id)
              ? destinationArr.flat(1)
              : [],
          };
        });

        setTransportationData(() => [...array]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //to get Origin Data from database
  const handleGetOrigin = async () => {
    const response = await getOriginData();
    if (response) {
      const originOptions = response.origin.map((d: any) => {
        return {
          label: d.portName,
          value: d._id,
        };
      });

      setOriginSelectOptions(() => [...originOptions]);
      handleGetSource();
      handleGetTransportation();
    }
  };

  //to get Source Data from database
  const handleGetSource = async () => {
    const response = await getSourceData();
    if (response) {
      const sourceOptions = response.source.map((d: any) => {
        return {
          label: d.region,
          value: d._id,
          state: d._state,
        };
      });
      setSourceSelectOptions(() => [...sourceOptions]);
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    const payload = data.sourceLocations.flatMap((d: any) => ({
      _originPortId: data._originPortId,
      ...d,
    }));

    if (data && modalType === "add") {
      const response = await postTransportationData(data);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Transportation Charges Added!",
          message: "",
          autoClose: 4000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (payload && modalType === "update") {
      const response = await patchTransportationData(payload);

      if (response) {
        handleGetOrigin();
        showNotification({
          title: "Transportation Charges Updated!",
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
      title: "Delete the Transportation Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the Transportation Data?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: {
        confirm: "Delete Transportation Data",
        cancel: "No, don't delete it",
      },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });
  const handleDeleteRow = async (data: any) => {
    const response = await deleteTransportationData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Tranportation Charges Deleted!",
        message: "",
        autoClose: 4000,
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
    if (
      transportationData.length &&
      sourceSelectOptions.length &&
      originSelectOptions.length
    ) {
      const tableData = transportationData.flatMap((list: any) => {
        return list.sourceLocations.map((item: any) => {
          const sourceOption = sourceSelectOptions.find(
            (d: any) => d.value === item._sourcePortId
          );
          //to display source label instead of _id
          const sourceName = sourceOption ? sourceOption.label : "Null";

          //to display origin label instead of _id
          const originOption = originSelectOptions.find(
            (d: any) => d.value === list._originPortId
          );
          const originName = originOption ? originOption.label : "Null";

          return {
            ...item,
            _originPortId: list._originPortId,
            origin: originName,
            source: sourceName,
          };
        });
      });
      setTableRowData(tableData);
    }
  }, [transportationData, sourceSelectOptions, originSelectOptions]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add"
          ? "Add Transportation Charges"
          : modalType === "upload"
          ? "Update Or Add Data by Excel Sheet"
          : "Update Transportation Charges"
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
            sourceSelectOptions={sourceSelectOptions}
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
          setModalType("update");
          let obj = { ...row };
          const formObj = {
            _originPortId: obj._originPortId,
            sourceLocations: [
              {
                _transportObjId: obj._id,
                transportationCharge: obj.transportationCharge,
                _sourcePortId: obj._sourcePortId,
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

export default ManageTransportContainer;
