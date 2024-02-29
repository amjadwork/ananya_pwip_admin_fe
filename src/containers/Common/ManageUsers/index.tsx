import React, { useEffect, useState } from "react";
import { Plus, Check } from "tabler-icons-react";

import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import EditUsersForm from "../../../forms/Common/ManageUsers";
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
    width: "80px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
  },
  {
    Header: "User_Id",
    accessor: "user_id",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Name",
    accessor: "full_name",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Email",
    accessor: "email",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Phone",
    accessor: "phone",
    width: "300px",
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Role",
    accessor: "roleName",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "City",
    accessor: "city",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Zip Code",
    accessor: "zip_code",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "State",
    accessor: "state",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Country",
    accessor: "country",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Profession",
    accessor: "profession",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Company",
    accessor: "CompanyName",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "GST",
    accessor: "gstin",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Created At",
    accessor: "CreatedAt",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Updated At",
    accessor: "UpdatedAt",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "100px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
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
      title: "Delete the User Data",
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

  const handleDeleteRow = async (rowData: any) => {
    const response = await deleteUsersData(rowData);

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
    if (usersData && usersData.length && profileData && profileData.length) {
      const tableData = usersData.map((user: any) => {
        const userProfile = profileData.find(
          (profile: any) => profile.user_id === user._id
        );
        const obj = {
          ...user,
          activeStatus: user.active === 1 ? "Active" : "Inactive",
          CreatedAt: IsoDateConverter(user.t_create),
          UpdatedAt: IsoDateConverter(user.t_update),
          ...userProfile,
        };
        const role = rolesData.find((role: any) => role._id === user.role_id);
        if (role) {
          obj.roleName = role.role;
        }
        return obj;
      });
      setTableRowData(tableData);
    }
  }, [usersData, profileData]);

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
        actionButtons={[]}
        onEditRow={(rowData: any) => {
          const formObj = {
            profile_id:rowData._id,
            user_id: rowData.user_id,
            email: rowData.email,
            first_name: rowData.first_name,
            middle_name: rowData.middle_name,
            last_name: rowData.last_name,
            full_name: rowData.full_name,
            phone: rowData.phone,
            role_id: rowData.role_id,
            roleName: rowData.roleName,
          };
          setUpdateFormData(formObj);
          setModalType("update");
          setModalOpen(true);
        }}
        onDeleteRow={(rowData: any) => {
          openDeleteModal(rowData);
        }}
      />
    </PageWrapper>
  );
}

export default ManageUsers;
