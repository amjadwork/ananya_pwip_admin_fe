import React, { useEffect, useState } from "react";
import { Plus, Check } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditContainerForm from "../../forms/ManageContainer/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";
import {
  getContainerData,
  postContainerData,
  deleteContainerData,
  putContainerData,
} from "../../services/export-costing/Container";

const columns = [
  {
    label: "No.",
    key: "serialNo",
    width: "35px",
    fixed: true,
  },
  {
    label: "Container Type",
    key: "type",
    width: "200px",
    sortable: true,
  },
  {
    label: "Container Size",
    key: "size",
    width: "150px",
  },
  {
    label: "Weight(in Tons)",
    key: "weight",
    width: "150px",
  },
  {
    label: "Units",
    key: "unit",
    width: "100px",
  },
  {
    label: "Action",
    key: "action",
    width: "60px",
    fixed:true,
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const modalType = props.modalType;

  return (
    <EditContainerForm
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageContainer() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [containerData, setContainerData] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [selectedTableRowIndex, setSelectedTableRowIndex] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Container Data from database
  const handleGetContainer = async () => {
    const response = await getContainerData();
    if (response) {
      setContainerData([...response]);
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    let payload = { ...data };

    if (payload && modalType === "add") {
      const response = await postContainerData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Container data added successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (payload && modalType === "update") {
      const response = await putContainerData(payload);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Container data updated successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }
  };

  // to delete a single row data
  const openDeleteModal = (rowData: any) =>
    openConfirmModal({
      title: "Delete the Container Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the Container Data?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: {
        confirm: "Delete Container Data",
        cancel: "No, don't delete it",
      },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteData(rowData),
    });

  const handleDeleteData = async (data: any) => {
    const response = await deleteContainerData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Container type deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetContainer();
  };

  useEffect(() => {
    handleGetContainer();
  }, []);

  useEffect(() => {
    if (containerData && containerData.length) {
      let tableData: any = [];
      containerData.forEach((d: any) => {
        const obj = { ...d };
        tableData.push(obj);
      });

      setTableRowData(tableData);
    }
  }, [containerData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={modalType === "add" ? "Add Container " : "Update Container"}
      onModalClose={() => {
        setModalOpen(false);
        setUpdateFormData(null);
      }}
      ModalContent={() => {
        return (
          <RenderModalContent
            handleCloseModal={(bool: boolean) => setModalOpen(bool)}
            handleSaveAction={handleSaveAction}
            updateFormData={updateFormData}
            modalType={modalType}
            modalOpen={modalOpen}
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
          setSelectedTableRowIndex(index);
          const formObj = {
            type: obj.type,
            size: obj.size,
            weight: obj.weight,
            unit: obj.unit,
            _id: obj._id,
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

export default ManageContainer;
