import React, { useEffect, useState } from "react";
import { Check } from "tabler-icons-react";
import { Text } from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditPackageForm from "../../forms/ManagePackage/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import ReactTable from "../../components/ReactTable/ReactTable";
import APIRequest from "../../helper/api";
import {
  // getPackagingData,
  postPackagingData,
  deletePackagingData,
  putPackagingData,
} from "../../services/export-costing/Packaging";
import {
  hasEditPermission,
  hasAddNewPermission,
  hasDeletePermission,
} from "../../helper/helper";


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
    Header: "Bag Type",
    accessor: "bag",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Weight(in Kgs)",
    accessor: "weight",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Cost(in INR)",
    accessor: "cost",
    width: "250px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "80px",
    sortable: false,
    fixed: true,
    disableFilters: true,
    filterable: false,
    showCheckbox: false,
  },
];

const initialBagTypes = [
  {
    type: "PP Woven",
    list: [],
  },
  {
    type: "Non Woven",
    list: [],
  },
  {
    type: "Jute",
    list: [],
  },
  {
    type: "PE",
    list: [],
  },
  {
    type: "BOPP",
    list: [],
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const modalType = props.modalType;

  return (
    <EditPackageForm
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManagePackageContainer() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [packagingData, setPackagingData] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [selectedTableRowIndex, setSelectedTableRowIndex] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Packaging Data from database
  const handleGetPackaging = async () => {
    const response = await APIRequest("packaging", "GET");
    if (response) {
      let initialList = [...initialBagTypes];
      const modList = initialList.map((d: any) => {
        const list = response.filter((p: any) => {
          if (d.type.toLowerCase() === p.bag.toLowerCase()) {
            return p;
          }
        });

        return {
          ...d,
          list: list,
        };
      });
      setPackagingData([...modList]);
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    let payload = { ...data };
    payload.currency = "INR";

    if (payload && modalType === "add") {
      const response = await postPackagingData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Packaging Charges Added!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (payload && modalType === "update") {
      const response = await putPackagingData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Packaging Charges Updated!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }
  };

  //to delete a single row data
  const openDeleteModal = (rowData: any) =>
    openConfirmModal({
      title: "Delete the Packaging Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the Packaging Data?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: {
        confirm: "Delete Packaging Data",
        cancel: "No, don't delete it",
      },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteData(rowData),
    });

  const handleDeleteData = async (data: any) => {
    const response = await deletePackagingData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Packaging Charges Deleted!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetPackaging();
  };

  useEffect(() => {
    handleGetPackaging();
  }, []);

  useEffect(() => {
    if (packagingData.length) {
      let tableData: any = [];
      [...packagingData].forEach((d: any) => {
        d.list.forEach((l: any) => {
          const obj = {
            ...l,
          };
          tableData.push(obj);
        });
      });

      setTableRowData(tableData);
    }
  }, [packagingData]);


    const actionButtons = [
      {
        label: "Add New",
        color: "gray",
        type: "button",
        onClickAction: () => {
          setModalOpen(true);
          setModalType("add");
        },
      },
    ];

    const conditionalActionButtons = hasAddNewPermission()
      ? actionButtons
      : [];

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add"
          ? "Add Packaging Charges"
          : "Update Packaging Charges"
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
            modalType={modalType}
            modalOpen={modalOpen}
          />
        );
      }}
      modalSize="70%"
    >
      <ReactTable
        data={tableRowData}
        columns={columns}
        actionButtons={conditionalActionButtons}
        onEditRow={(row: any, index: any) => {
          if (hasEditPermission()) {
            let obj = { ...row };
            setSelectedTableRowIndex(index);
            const formObj = {
              bag: obj.bag,
              weight: obj.weight,
              cost: obj.cost,
              _id: obj._id,
            };
            setUpdateFormData(formObj);
            setModalType("update");
            setModalOpen(true);
          }
        }}
        onDeleteRow={
          hasDeletePermission()
            ? (rowData: any) => {
                openDeleteModal(rowData);
              }
            : undefined
        }
      />
    </PageWrapper>
  );
}

export default ManagePackageContainer;
