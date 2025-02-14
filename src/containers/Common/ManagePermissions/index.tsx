import React, { useEffect, useState } from "react";
import { Plus, Check } from "tabler-icons-react";

import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import EditPermissionsForm from "../../../forms/Common/ManagePermissions";
import ReactTable from "../../../components/ReactTable/ReactTable";
import {
  getPermissionsData,
  postPermissionsData,
  putPermissionsData,
  deletePermissionsData,
} from "../../../services/user-management/PermissionAndRoles";

const columns = [
  {
    Header: "No.",
    accessor: "serialNo",
    width: "30px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
  },
  {
    Header: "Permission_Id",
    accessor: "_id",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Permission",
    accessor: "permission",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "60px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
  },
];

const RenderModalContent = (props: any) => {
  const permissionsData = props.permissionsData;
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const variantSelectOptions = props.variantSelectOptions;
  const modalType = props.modalType;

  return (
    <EditPermissionsForm
      permissionsData={permissionsData}
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      variantSelectOptions={variantSelectOptions}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManagePermissions() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [permissionsData, setPermissionsData] = useState<any>([]);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Permission Data from database
  const handleGetPermissionsData = async () => {
    const response = await getPermissionsData();
    if (response) {
      setPermissionsData([...response]);
    }
  };

  const handleSaveAction = async (data: any) => {
    let payload = { ...data };

    if (payload && modalType === "add") {
      const response = await postPermissionsData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Permission added successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (payload && modalType === "update") {
      const response = await putPermissionsData(payload);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Permission updated successfully!",
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
      title: "Delete the Service Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this Permission?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete Permission", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });

  const handleDeleteRow = async (data: any) => {
    const response = await deletePermissionsData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Permission deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetPermissionsData();
  };
  useEffect(() => {
    handleGetPermissionsData();
  }, []);

  useEffect(() => {
    if (permissionsData && permissionsData.length) {
      setTableRowData(permissionsData);
    }
  }, [permissionsData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add New Permission" : "Update Permission Name"
      }
      onModalClose={() => {
        setModalOpen(false);
        setUpdateFormData(null);
      }}
      ModalContent={() => {
        return (
          <RenderModalContent
            permissionsData={permissionsData}
            handleCloseModal={(bool: boolean) => setModalOpen(bool)}
            handleSaveAction={handleSaveAction}
            updateFormData={updateFormData}
            modalType={modalType}
            modalOpen={modalOpen}
          />
        );
      }}
      modalSize="50%"
    >
      <ReactTable
        data={tableRowData}
        columns={columns}
        actionButtons={[
          {
            label: "Add New",
            color: "gray",
            type: "button",
            onClickAction: () => {
              setModalOpen(true);
              setModalType("add");
            },
          },
        ]}
        onEditRow={(row: any) => {
          let obj = { ...row };
          const formObj = {
            _id: obj._id,
            permission: obj.permission,
          };
          setUpdateFormData(formObj);
          setModalType("update");
          setModalOpen(true);
        }}
        onDeleteRow={(row: any) => {
          openDeleteModal(row);
        }}
      />
    </PageWrapper>
  );
}

export default ManagePermissions;
