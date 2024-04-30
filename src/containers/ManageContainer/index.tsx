import React, { useEffect, useState } from "react";
import { Check } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditContainerForm from "../../forms/ManageContainer/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import ReactTable from "../../components/ReactTable/ReactTable";
import {
  getContainerData,
  postContainerData,
  deleteContainerData,
  putContainerData,
} from "../../services/export-costing/Container";
import {
  hasEditPermission,
  hasAddNewPermission,
  hasDeletePermission,
} from "../../helper/helper";


const columns = [
  {
    Header: "No.",
    accessor: "serialNo",
    width: "40px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
  },
  {
    Header: "Container Type",
    accessor: "type",
    width: "180px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Container Size",
    accessor: "size",
    width: "180px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Weight(in Tons)",
    accessor: "weight",
    width: "180px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Units",
    accessor: "unit",
    width: "150px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "70px",
    sortable: false,
    fixed: true,
    disableFilters: true,
    filterable: false,
    showCheckbox: false,
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


    const actionButtons = [
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

    const conditionalActionButtons = hasAddNewPermission() ? actionButtons : [];


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
      <ReactTable
        data={tableRowData}
        columns={columns}
        actionButtons={conditionalActionButtons}
        onEditRow={(row: any, index: any) => {
          if (hasEditPermission()) {
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

export default ManageContainer;
