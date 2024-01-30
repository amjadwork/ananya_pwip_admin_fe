import React, { useEffect, useState } from "react";
import { Plus, Check } from "tabler-icons-react";

import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import EditUsersForm from "../../../forms/Common/ManageUsers";
import DataTable from "../../../components/DataTable/DataTable";
import ReactTable from "../../../components/ReactTable/ReactTable";
import {
  getUsersData,
  deleteUsersData,
  patchUsersData,
  getProfileData,
  patchProfileData,
} from "../../../services/user-management/Users";
import { getRolesData } from "../../../services/user-management/PermissionAndRoles";
import { IsoDateConverter } from "../../../helper/helper";

const columns = [
  {
    Header: "No.",
    accessor: "serialNo",
    width: "70px",
    fixed: true,
  },
  {
    Header: "User_Id",
    accessor: "_id",
    width: "90px",
    sortable: true,
    filterable: true,
  },
  {
    Header: "Name",
    accessor: "full_name",
    width: "230px",
    sortable: true,
    filterable: true,
  },
  {
    Header: "Email",
    accessor: "email",
    width: "300px",
    sortable: true,
    filterable: true,
  },
  {
    Header: "Phone",
    accessor: "phone",
    width: "130px",
    sortable: true,
    filterable: true,
  },
  {
    Header: "Role",
    accessor: "roleName",
    width: "130px",
    sortable: true,
    filterable: true,
  },
  {
    Header: "Created At",
    accessor: "t_create",
    width: "180px",
    sortable: true,
  },
  {
    Header: "Updated At",
    accessor: "t_update",
    width: "180px",
    sortable: true,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "100px",
    fixed: true,
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
      console.log(usersData, "userData")
      const tableData = usersData.map((d: any) => {
        const obj = {
          ...d,
          activeStatus: d.active === 1 ? "Active" : "Inactive",
          t_create: IsoDateConverter(d.t_create),
          t_update: IsoDateConverter(d.t_update),
        };
        const role = rolesData.find((role: any) => role._id === d.role_id);
        if (role) {
          obj.roleName = role.role;
        }
        return obj;
      });
      console.log(tableData)
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
       <ReactTable
        data={tableRowData}
        columns={columns}
        // actionItems={[]}
        onEditRow={(row: any) => {
          const formObj = {
            _id: row._id,
            email: row.email,
            first_name: row.first_name,
            middle_name: row.middle_name,
            last_name: row.last_name,
            full_name: row.full_name,
            phone: row.phone,
            role_id: row.role_id,
            roleName: row.roleName,
          };
          setUpdateFormData(formObj);
          setModalType("update");
          setModalOpen(true);
        }}
        onDeleteRow={handleDeleteRow}
      />
    </PageWrapper>
  );
}

export default ManageUsers;
