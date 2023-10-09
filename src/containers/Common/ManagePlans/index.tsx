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

const columns = [
  {
    label: "ID",
    key: "id",
    sortable: true,
  },
  {
    label: "Plans",
    key: "name",
    sortable: true,
  },
  {
    label: "Applicable Services",
    key: "servicesNames",
  },
  {
    label: "Price",
    key: "cost",
  },
  {
    label: "Valid For",
    key: "validityFor",
  },
  {
    label: "Refundable",
    key: "refund",
  },
  {
    label: "Action",
    key: "action",
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const variantSelectOptions = props.variantSelectOptions;
  const servicesData = props.servicesData;
  const modalType = props.modalType;

  return (
    <EditPlansForm
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      variantSelectOptions={variantSelectOptions}
      updateFormData={updateFormData}
      servicesData={servicesData}
      modalType={modalType}
    />
  );
};

function ManagePlans() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [plansData, setPlansData] = useState<any>([]);
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

        const obj = {
          ...d,
          cost: `${d.price} ${d.currency}`,
          validityFor: `${d.validity} ${d.validity_type}`,
          refund: `${
            d.refund_policy ? `Yes, ${d.refund_policy_valid_day} day/s` : "No"
          }`,
          servicesNames: servicesNames,
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
          const formObj = {
            name: obj.name,
            description: obj.description,
            validity_type: obj.validity_type,
            validity: obj.validity,
            applicable_services: obj.applicable_services,
            refund_policy: obj.refund_policy,
            refund_policy_valid_day: obj.refund_policy_valid_day,
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
