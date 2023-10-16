import React, { useEffect, useState } from "react";
import { Plus, Check } from "tabler-icons-react";

import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import EditUsersForm from "../../../forms/Common/ManageUsers";
import DataTable from "../../../components/DataTable/DataTable";
import {
  getUsersData,
  deleteUsersData,
  patchUsersData,
  getProfileData,
  patchProfileData,
} from "../../../services/user-management/Users";
import { getRolesData } from "../../../services/user-management/PermissionAndRoles";

const columns = [
  {
    label: "Id",
    key: "_id",
    width: "70px",
    sortable: false,
  },
  {
    label: "Name",
    key: "full_name",
    width: "230px",
    sortable: true,
  },
  {
    label: "Email",
    key: "email",
    width: "230px",
    sortable: true,
  },
  {
    label: "Phone",
    key: "phone",
    width: "130px",
    sortable: true,
  },
  {
    label: "Role",
    key: "roleName",
    width: "130px",
    sortable: true,
  },
  {
    label: "Action",
    key: "action",
    width: "80px",
  },
];

const RenderModalContent = (props: any) => {
  const usersData = props.usersData;
  const rolesData = props.rolesData;
  const profileData = props.profileData;
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const handleUserPatch = props.handleUserPatch;
  const handleProfilePatch = props.handleProfilePatch;
  const variantSelectOptions = props.variantSelectOptions;
  const modalType = props.modalType;

  return (
    <EditUsersForm
      usersData={usersData}
      profileData={profileData}
      rolesData={rolesData}
      handleCloseModal={handleCloseModal}
      handleUserPatch={handleUserPatch}
      handleProfilePatch={handleProfilePatch}
      variantSelectOptions={variantSelectOptions}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageUsers() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [usersData, setUsersData] = useState<any>([]);
  const [profileData, setProfileData] = useState<any>([]);
  const [rolesData, setRolesData] = useState<any>([]);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get User Data from database
  const handleGetUsersData = async () => {
    const response = await getUsersData();
    if (response) {
      setUsersData([...response]);
    }
  };

  const handleGetProfileData = async () => {
    const response = await getProfileData();
    if (response) {
      setProfileData([...response]);
    }
  };

  const handleGetRolesData = async () => {
    const response = await getRolesData();
    if (response) {
      setRolesData([...response]);
    }
  };

  const handleUserPatch = async (data: any) => {
    let payload = { ...data };

    if (payload && modalType === "update") {
      const response = await patchUsersData(payload);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "User updated successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }
  };
  const handleProfilePatch = async (data: any) => {
    let payload = { ...data };

    if (payload && modalType === "update") {
      const response = await patchProfileData(payload);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Profile updated successfully!",
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
          Are you sure you want to delete this User?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete User", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });

  const handleDeleteRow = async (data: any) => {
    const response = await deleteUsersData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "User deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetUsersData();
    handleGetRolesData();
    handleGetProfileData();
  };

  useEffect(() => {
    handleGetUsersData();
    handleGetRolesData();
    handleGetProfileData();
  }, []);

  useEffect(() => {
    if (usersData && usersData.length) {
      const tableData = usersData.map((d: any) => {
        const obj = {
          ...d,
          activeStatus: d.active === 1 ? "Active" : "Inactive",
        };
        const role = rolesData.find((role: any) => role._id === d.role_id);
        if (role) {
          obj.roleName = role.role;
        }
        return obj;
      });
      setTableRowData(tableData);
    }
  }, [usersData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add New Permission" : "Update User Details"
      }
      onModalClose={() => {
        setModalOpen(false);
        setUpdateFormData(null);
      }}
      ModalContent={() => {
        return (
          <RenderModalContent
            usersData={usersData}
            profileData={profileData}
            rolesData={rolesData}
            handleCloseModal={(bool: boolean) => setModalOpen(bool)}
            handleUserPatch={handleUserPatch}
            handleProfilePatch={handleProfilePatch}
            updateFormData={updateFormData}
            modalType={modalType}
            modalOpen={modalOpen}
          />
        );
      }}
      modalSize="60%"
    >
      <DataTable
        data={tableRowData}
        columns={columns}
        actionItems={[]}
        handleRowEdit={(row: any, index: number) => {
          let obj = { ...row };
          const formObj = {
            _id: obj._id,
            email: obj.email,
            first_name: obj.first_name,
            middle_name: obj.middle_name,
            last_name: obj.last_name,
            full_name: obj.full_name,
            phone: obj.phone,
            role_id: obj.role_id,
            roleName: obj.roleName,
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

export default ManageUsers;
