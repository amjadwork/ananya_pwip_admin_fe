import React, { useEffect, useState } from "react";
import { Plus, Check } from "tabler-icons-react";
import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditPlansForm from "../../../forms/Common/ManagePlans";

import PageWrapper from "../../../components/Wrappers/PageWrapper";
import DataTable from "../../../components/DataTable/DataTable";
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
    label: "No.",
    key: "serialNo",
    width: "50px",
    fixed: true,
  },
  {
    label: "Plan_ID",
    key: "id",
    width: "90px",
    sortable: true,
  },
  {
    label: "Plans",
    key: "name",
    width: "300px",
    sortable: true,
  },
  {
    label: "Applicable Services",
    key: "servicesNames",
    width: "300px",
  },
  {
    label: "Applicable Users",
    key: "applicableUsers",
    width: "350px",
  },
  {
    label: "Price",
    key: "cost",
    width: "150px",
  },
  {
    label: "Usage Limit",
    key: "usage_cap",
    width: "150px",
  },
  {
    label: "Valid For",
    key: "validityFor",
    width: "150px",
  },
  {
    label: "Refundable",
    key: "refund",
    width: "150px",
  },
  {
    label: "Is Free?",
    key: "is_free",
    width: "150px",
  },
  {
    label: "Is Unlimited?",
    key: "is_unlimited",
    width: "150px",
  },
  {
    label: "Action",
    key: "action",
    width: "90px",
    fixed: true,
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
              return `${user.email}, ${user.full_name}`;
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
            d.refund_policy ? `Yes, ${d.refund_policy_valid_day} day/s` : "No"
          }`,
          servicesNames: servicesNames,
          applicableUsers: applicableUsers,
          usage_cap: d.usage_cap || 0,
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
          console.log(obj, "obj");
          const formObj = {
            name: obj.name,
            description: obj.description,
            validity_type: obj.validity_type,
            validity: obj.validity,
            applicable_services: obj.applicable_services,
            applicable_for_users: obj.applicable_for_users,
            refund_policy: obj.refund_policy,
            refund_policy_valid_day: obj.refund_policy_valid_day,
            show_to_user: obj.show_to_user,
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
        handleRowDelete={(row: any) => {
          openDeleteModal(row);
        }}
      />
    </PageWrapper>
  );
}

export default ManagePlans;
