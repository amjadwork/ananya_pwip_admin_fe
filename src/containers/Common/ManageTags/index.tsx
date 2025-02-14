import React, { useEffect, useState } from "react";
import { Plus, Check } from "tabler-icons-react";
import { Title, Box } from "@mantine/core";
import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditTagsForm from "../../../forms/Common/ManageTags";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import ReactTable from "../../../components/ReactTable/ReactTable";
import {
  getTagsData,
  postTagsData,
  deleteTagsData,
  patchTagsData,
} from "../../../services/tags-management/Tags";

const columns = [
  {
    Header: "No.",
    accessor: "serialNo",
    width: "30px",
    fixed: true,
    disableFilters: true,
    showCheckbox: false,
  },
  {
    Header: "Tag Name",
    accessor: "tagName",
    width: "500px",
    sortable: true,
    filterable: true,
    showCheckbox: false,
  },
  {
    Header: "Action",
    accessor: "action",
    width: "50px",
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
  const modalType = props.modalType;

  return (
    <EditTagsForm
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      variantSelectOptions={variantSelectOptions}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageTags() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [tagsData, setTagsData] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get Tags  Data from database
  const handleGetTagsData = async () => {
    const response = await getTagsData();
    if (response) {
      setTagsData([...response]);
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    let payload = { ...data };

    if (payload && modalType === "add") {
      const response = await postTagsData(payload);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "New Tag added successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (payload && modalType === "update") {
      const response = await patchTagsData(payload);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Tag Name updated successfully!",
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
      title: "Delete the Tag Name",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this Tag?
          <Text fw={500}>
            Note: Deleting tag will affect modules which have this tag, make
            sure to unlink the tags before deleting it from here.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete Tag ", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });

  const handleDeleteRow = async (data: any) => {
    const response = await deleteTagsData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Tag deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetTagsData();
  };

  useEffect(() => {
    handleGetTagsData();
  }, []);

  useEffect(() => {
    if (tagsData && tagsData.length) {
      let tableData: any = [];
      tagsData.forEach((d: any) => {
        const obj = {
          ...d,
        };
        tableData.push(obj);
      });
      setTableRowData(tableData);
    }
  }, [tagsData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={modalType === "add" ? "Add New Tag" : "Update Tag Name"}
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
            tagName: obj.tagName,
            _id: obj._id,
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

export default ManageTags;
