import React, { useEffect, useState } from "react";
import { Plus, Check } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditOtherChargesForm from "../../forms/ManageOthers/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";
import { getVariantData } from "../../services/export-costing/Products";
import {
  getOtherChargesData,
  postOtherChargesData,
  deleteOtherChargesData,
  putOtherChargesData,
} from "../../services/export-costing/Others";

const columns = [
  {
    label: "Type of Charge",
    key: "typeOfCharge",
    width: "200px",
    sortable: true,
  },
  {
    label: "Type of Value",
    key: "typeOfValue",
    width: "150px",
  },
  {
    label: "Value",
    key: "value",
    width: "100px",
  },
  {
    label: "Action",
    key: "action",
    width: "45px",
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const variantSelectOptions = props.variantSelectOptions;
  const modalType = props.modalType;

  return (
    <EditOtherChargesForm
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      variantSelectOptions={variantSelectOptions}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageOthers() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [otherChargesData, setOtherChargesData] = useState<any>([]);
  const [variantSelectOptions, setVariantSelectOptions] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Other Charges Data from database
  const handleGetOtherCharges = async () => {
    const response = await getOtherChargesData();
    if (response) {
      setOtherChargesData([...response]);
    }
    handleGetVariant();
  };

  //to get Container Data from database
  const handleGetVariant = async () => {
    const response = await getVariantData();
    if (response) {
      const variantOptions = response.map((d: any) => {
        return {
          label: d.variantName,
          value: d._id,
        };
      });

      setVariantSelectOptions(() => [...variantOptions]);
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    let payload = { ...data };

    if (payload && modalType === "add") {
      const response = await postOtherChargesData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Charge added successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (payload && modalType === "update") {
      const response = await putOtherChargesData(payload);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Charge updated successfully!",
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
      title: "Delete the Other Charges Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the Charges Data?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: {
        confirm: "Delete Other Charge Data",
        cancel: "No, don't delete it",
      },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });

  const handleDeleteRow = async (data: any) => {
    const response = await deleteOtherChargesData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Charge deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetOtherCharges();
  };

  useEffect(() => {
    handleGetOtherCharges();
  }, []);

  useEffect(() => {
    if (otherChargesData && otherChargesData.length) {
      let tableData: any = [];
      otherChargesData.forEach((d: any) => {
        const obj = { ...d };
        tableData.push(obj);
      });

      setTableRowData(tableData);
    }
  }, [otherChargesData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add Other Charges" : "Update Other Charges"
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
            variantSelectOptions={variantSelectOptions}
            updateFormData={updateFormData}
            modalType={modalType}
            modalOpen={modalOpen}
          />
        );
      }}
      modalSize="70%"
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
            typeOfCharge: obj.typeOfCharge,
            typeOfValue: obj.typeOfValue,
            applicableFor: obj.applicableFor,
            value: obj.value,
            _id: obj._id,
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

export default ManageOthers;
