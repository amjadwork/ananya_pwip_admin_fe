import React, { useEffect, useState } from "react";
import { Check } from "tabler-icons-react";

import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditRolesForm from "../../../forms/Common/ManageRoles";

import PageWrapper from "../../../components/Wrappers/PageWrapper";
import ReactTable from "../../../components/ReactTable/ReactTable";
import {
  getRolesData,
  postRolesData,
  deleteRolesData,
  putRolesData,
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
    Header: "Role_Id",
    accessor: "_id",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Role",
    accessor: "role",
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
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const variantSelectOptions = props.variantSelectOptions;
  const modalType = props.modalType;

  return (
    <EditRolesForm
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      variantSelectOptions={variantSelectOptions}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageRoles() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [rolesData, setRolesData] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Roles  Data from database
  const handleGetRolesData = async () => {
    const response = await getRolesData();
    if (response) {
      setRolesData([...response]);
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    let payload = { ...data };

    if (payload && modalType === "add") {
      const response = await postRolesData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Service added successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (payload && modalType === "update") {
      const response = await putRolesData(payload);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Role updated successfully!",
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
          Are you sure you want to delete this Role?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete Role", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });

  const handleDeleteRow = async (data: any) => {
    const response = await deleteRolesData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Role deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetRolesData();
  };

  useEffect(() => {
    handleGetRolesData();
  }, []);

  useEffect(() => {
    if (rolesData && rolesData.length) {
      let tableData: any = [];
      rolesData.forEach((d: any) => {
        const obj = {
          ...d,
        };
        tableData.push(obj);
      });
      setTableRowData(tableData);
    }
  }, [rolesData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={modalType === "add" ? "Add Role Name" : "Update Role Name"}
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
            role: obj.role,
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

export default ManageRoles;
