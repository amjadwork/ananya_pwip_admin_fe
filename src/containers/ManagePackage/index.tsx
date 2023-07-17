import React, { useEffect } from "react";
import {Plus } from "tabler-icons-react";
import {Text} from "../../components/index";
import { openConfirmModal } from "@mantine/modals";

import EditPackageForm from "../../forms/ManagePackage";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";
import APIRequest from "../../helper/api";


const columns = [
  {
    label: "Bag Type",
    key: "bag",
    sortable: true,
  },
  {
    label: "Weight(in Kgs)",
    key: "weight",
  },
  {
    label: "Cost(in INR)",
    key: "cost",
  },
  {
    label: "Action",
    key: "action",
  },
];

const initialBagTypes = [
  {
    type: "PPWOVEN",
    list: [],
  },
  {
    type: "JUTE",
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
  const handleSaveCallback = props.handleSaveCallback;
  const updateFormData = props.updateFormData;
  const modalType=props.modalType;
  const modalOpen = props.modalOpen;

  return (
    <EditPackageForm
      handleCloseModal={handleCloseModal}
      handleSaveCallback={handleSaveCallback}
      updateFormData={updateFormData}
      modalType={modalType}
      modalOpen={modalOpen}
    />
  );
};

function ManagePackageContainer() {
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [modalType, setModalType] = React.useState<string>("add");
  const [packagingList, setPackagingList] = React.useState([
    ...initialBagTypes,
  ]);
  const [tableRowData, setTableRowData] = React.useState<any>([]);
  const [selectedTableRowIndex, setSelectedTableRowIndex] =
  React.useState<any>(null);
  const [updateFormData, setUpdateFormData] = React.useState<any>(null);

  // const handleEditAction = (bool: boolean) => {
  //   setEditModeActive(bool);
  //   setModalType("edit");
  // };

  // const handleEditToUpdateAction = () => {
  //   setModalType("update");
  //   setModalOpen(true);
  // };

  const handleSaveCallback = (payload: any) => {
    setModalOpen(false);
    handleSave(payload);
  };
  const handleRefreshCalls = () => {
    handleGetPackagingList();
  };

  const handleSaveAction = () => {
    // Implement the handleSaveAction logic here
    // For example, to save data to the backend
  };

  const handleGetPackagingList = async () => {
    const packagingResponse: any = await APIRequest(`packaging`, "GET");
    if (packagingResponse) {
      let initialList = [...initialBagTypes];
      const modList = initialList.map((d: any) => {
        const list = packagingResponse.filter((p: any) => {
          if (d.type.toLowerCase() === p.bag.toLowerCase()) {
            return p;
          }
        });

        return {
          ...d,
          list: list,
        };
      });
      setPackagingList([...modList]);
    }
  };

  useEffect(() => {
    handleGetPackagingList();
  }, []);

  const handleSave = async (payload:any) => {
    let obj = { ...payload };
    obj.currency = "INR";
  
    try {
      const method = modalType === "add" ? "POST" : "PATCH";
      const response = await APIRequest("packaging", method, obj);
  
      if (response) {
        handleRefreshCalls();
      }
    } catch (error) {
      console.error("Error while saving:", error);
    }
  };

  const handleDeleteVariant = async (data: any) => {
    // const deleteVariantResponse = await APIRequest(
    //   "packaging" + "/" + data.packaging + "/" + data._id,
    //   "DELETE"
    // );

    // if (deleteVariantResponse) {
    //   handleRefreshCalls();
    // }
  };

  const openDeleteModal = (rowData: any) =>
    openConfirmModal({
      title: "Delete the Packaging Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the packaging detail? 
          <Text fw={500}>Note:This action is destructive and you will have to contact support to restore
          this data.</Text> 
          </Text>
      ),
      labels: { confirm: "Delete Packaging Data", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteVariant(rowData),
    });

  React.useEffect(() => {
    if (packagingList.length) {
      let tableData: any = [];

      [...packagingList].forEach((d: any) => {
        d.list.forEach((l: any) => {
          const obj = {
            ...l,
          };
          tableData.push(obj);
        });
      });

      setTableRowData(tableData);
    }
  }, [packagingList]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={modalType === "add" ? "Add Packaging Charges" : "Update Packaging Charges"}
    onModalClose={() => {
      setModalOpen(false);
      setUpdateFormData(null);
      setSelectedTableRowIndex(null);
    }}
    ModalContent={() => {
      return (
        <RenderModalContent
          handleCloseModal={(bool: boolean) => setModalOpen(bool)}
          handleSaveCallback={handleSaveCallback}
          // variantsData={selectedVariantData}
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
          setSelectedTableRowIndex(index);

          const formObj = {
            bag: obj.bag,
            weight: obj.weight,
            cost:obj.cost,
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

export default ManagePackageContainer;
