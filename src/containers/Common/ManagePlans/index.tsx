import React, { useEffect, useState } from "react";
import { Check } from "tabler-icons-react";
import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditPlansForm from "../../../forms/Common/ManagePlans";

import PageWrapper from "../../../components/Wrappers/PageWrapper";
import ReactTable from "../../../components/ReactTable/ReactTable";
import { getServicesData } from "../../../services/plans-management/SubscriptionsAndServices";
import {
  getPlansData,
  postPlansData,
  deletePlansData,
  putPlansData,
} from "../../../services/plans-management/Plans";
import { getUsersData } from "../../../services/user-management/Users";

const columns = [
  {
    Header: "No.",
    accessor: "serialNo",
    width: "50px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
  },
  {
    Header: "Plan Id",
    accessor: "id",
    width: "270px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Name",
    accessor: "name",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Services",
    accessor: "servicesNames",
    width: "300px",
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Users",
    accessor: "applicableUsers",
    width: "300px",
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Price",
    accessor: "cost",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Usage Limit",
    accessor: "usage_cap",
    width: "310px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Validity",
    accessor: "validityFor",
    width: "280px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Refundable?",
    accessor: "refund",
    width: "320px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Free?",
    accessor: "isFree",
    width: "300px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Unlimited?",
    accessor: "isUnlimited",
    width: "310px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Show User?",
    accessor: "showToUser",
    width: "310px",
    sortable: true,
    filterable: true,
    showCheckbox: true,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "90px",
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
  const servicesData = props.servicesData;
  const modalType = props.modalType;
  const usersData = props.usersData;

  return (
    <EditPlansForm
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      variantSelectOptions={variantSelectOptions}
      updateFormData={updateFormData}
      servicesData={servicesData}
      usersData={usersData}
      modalType={modalType}
    />
  );
};

function ManagePlans() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [plansData, setPlansData] = useState<any>([]);
  const [usersData, setUsersData] = useState<any>([]);
  const [servicesData, setServicesData] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Plans  Data from database
  const handleGetPlansData = async () => {
    const response = await getPlansData();

    if (response) {
      setPlansData([...response]);
    }
  };

  //to get User Data from database
  const handleGetUsersData = async () => {
    const response = await getUsersData();
    if (response) {
      setUsersData([...response]);
    }
  };

  //to get Services  Data from database
  const handleGetServicesData = async () => {
    const response = await getServicesData();

    if (response) {
      setServicesData([...response]);
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    let payload = { ...data };

    if (payload && modalType === "add") {
      const response = await postPlansData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Plan added successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (payload && modalType === "update") {
      const response = await putPlansData(payload);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Plan updated successfully!",
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
      title: "Delete the Plans Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this Plan Data?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete Plan Data", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });

  const handleDeleteRow = async (data: any) => {
    const response = await deletePlansData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Plan deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetPlansData();
  };

  useEffect(() => {
    handleGetPlansData();
    handleGetServicesData();
    handleGetUsersData();
  }, []);

  useEffect(() => {
    if (plansData && plansData.length) {
      let tableData: any = [];
      plansData.forEach((d: any) => {
        const servicesNames = d.applicable_services
          .map((serviceId: any) => {
            const service = servicesData.find((s: any) => s.id === serviceId);
            if (service && service.active === 1) {
              return service.name;
            }
            return null;
          })
          .filter((serviceName: any) => serviceName !== null);

        const applicableUsers = (d.applicable_for_users ?? [])
          .map((userId: any) => {
            const user = usersData.find((u: any) => u._id === userId);
            if (user && user.active === 1) {
              return `${user.email}`;
            }
            return null;
          })
          .filter((userName: any) => userName !== null);

        const validityFor =
          d.validity_type === "days" && d.validity
            ? ` ${d.validity} ${d.validity === 1 ? "day" : "days"}`
            : d.validity_type === "hours" && d.validity
              ? `${d.validity} ${d.validity === 1 ? "hour" : "hours"}`
              : null;

        const obj = {
          ...d,
          cost: `${d.price} ${d.currency}`,
          validityFor: validityFor || "Not Applicable",
          refund: `${
            d.refund_policy === 1
              ? `Yes, ${d.refund_policy_valid_day} day/s`
              : "No"
          }`,
          servicesNames: servicesNames,
          applicableUsers: applicableUsers,
          usage_cap: d.usage_cap || 0,
          isFree: d.is_free === 1 ? "Yes" : "No",
          isUnlimited: d.is_unlimited === 1 ? "Yes" : "No",
          showToUser: d.show_for_user === 1 ? "Yes" : "No",
        };
        tableData.push(obj);
      });
      setTableRowData(tableData);
    }
  }, [plansData, servicesData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add"
          ? "Add Plan and Descriptions"
          : "Update Plan and Descriptions"
      }
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
            servicesData={servicesData}
            usersData={usersData}
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
            name: obj.name,
            description: obj.description,
            validity_type: obj.validity_type,
            validity: obj.validity,
            applicable_services: obj.applicable_services,
            applicable_for_users: obj.applicable_for_users,
            refund_policy: obj.refund_policy,
            refund_policy_valid_day: obj.refund_policy_valid_day,
            show_for_user: obj.show_for_user,
            is_free: obj.is_free,
            is_unlimited: obj.is_unlimited,
            usage_cap: obj.usage_cap,
            price: obj.price,
            currency: obj.currency,
            id: obj.id,
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

export default ManagePlans;
