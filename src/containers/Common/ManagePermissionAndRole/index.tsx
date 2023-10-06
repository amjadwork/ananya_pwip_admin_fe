import React, { useEffect, useState } from "react";
import { Plus, Check, PremiumRights } from "tabler-icons-react";

import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import PageWrapper from "../../../components/Wrappers/PageWrapper";
import EditPermissionAndRoleForm from "../../../forms/Common/ManagePermissionAndRole";
import DataTable from "../../../components/DataTable/DataTable";
import {
  getRolesData,
  getPermissionsData,
  getRoleAndPermissionsData,
  postRoleAndPermissionsData,
  putRoleAndPermissionsData,
} from "../../../services/user-management/PermissionAndRoles";

const columns = [
  {
    label: "Role",
    key: "role",
    sortable: true,
  },
  {
    label: "Role ID",
    key: "_id",
    sortable: true,
  },
  {
    label: "Permissions",
    key: "permissionName",
  },
  {
    label: "Action",
    key: "action",
  },
];

const RenderModalContent = (props: any) => {
  const rolesData = props.rolesData;
  const permissionsData = props.permissionsData;
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const variantSelectOptions = props.variantSelectOptions;
  const modalType = props.modalType;

  return (
    <EditPermissionAndRoleForm
      rolesData={rolesData}
      permissionsData={permissionsData}
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      variantSelectOptions={variantSelectOptions}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManagePermissionAndRole() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [rolesData, setRolesData] = useState<any>([]);
  const [permissionsData, setPermissionsData] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Roles Data from database
  const handleGetRolesData = async () => {
    const response = await getRolesData();
    if (response) {
      setRolesData([...response]);
    }
  };

  //to get Permissions Data from database
  const handleGetPermissionsData = async () => {
    const response = await getPermissionsData();
    if (response) {
      setPermissionsData([...response]);
    }
  };

  // to get Permission by specific role ID
  const handleGetPermissionsByRoleId = async (id: any) => {
    const response = await getRoleAndPermissionsData(id);
    if (response) {
      return response;
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    let payload = { ...data };

    if (payload && modalType === "add") {
      const response = await postRoleAndPermissionsData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Role and Permissions added successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (payload && modalType === "update") {
      const response = await putRoleAndPermissionsData(payload);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Permissions updated successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }
  };

  const handleRefreshCalls = () => {
    handleGetRolesData();
    handleGetPermissionsData();
  };
  useEffect(() => {
    handleGetRolesData();
    handleGetPermissionsData();
    handleGetPermissionsByRoleId([]);
  }, []);

  useEffect(() => {
    if (rolesData && rolesData.length) {
      const fetchPermissionsForRole = async () => {
        const updatedTableData = await Promise.all(
          rolesData.map(async (role: any) => {
            const permissionByRoleID = await handleGetPermissionsByRoleId(
              role._id
            );
            const permission_ID = permissionByRoleID.map(
              (list: any) => list.permission_id
            );
            const permissionNames = permissionsData
              .filter((permission: any) =>
                permission_ID.includes(permission._id)
              )
              .map((permission: any) => permission.permission);

            return {
              ...role,
              permissionName: permissionNames,
              permissionId: permission_ID,
            };
          })
        );

        setTableRowData(updatedTableData);
      };

      fetchPermissionsForRole();
    }
  }, [rolesData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add"
          ? "Add New Role and Permissions"
          : "Update Role and Permissions"
      }
      onModalClose={() => {
        setModalOpen(false);
        setUpdateFormData(null);
      }}
      ModalContent={() => {
        return (
          <RenderModalContent
            rolesData={rolesData}
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
      <DataTable
        data={tableRowData}
        columns={columns}
        showRowDeleteAction={false}
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
          const formObj = {
            roleId: obj._id,
            role: obj.role,
            permissionId: obj.permissionId,
          };

          setUpdateFormData(formObj);
          setModalType("update");
          setModalOpen(true);
        }}
      />
    </PageWrapper>
  );
}

export default ManagePermissionAndRole;
