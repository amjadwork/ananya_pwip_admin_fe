import React, { useEffect, useState } from "react";
import { Plus, Check } from "tabler-icons-react";
import { Text } from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditLearnForm from "../../../forms/Common/ManageLearn";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import DataTable from "../../../components/DataTable/DataTable";
import VideoPlayModal from "../../../components/VideoPlayModal/VideoPlayModal";
import { getTagsData } from "../../../services/tags-management/Tags";
import {
  getLearnData,
  postLearnData,
  deleteLearnData,
  patchLearnData,
} from "../../../services/learn-management/Learn";

const columns = [
  {
    label: "Title",
    key: "title",
    width: "130px",
  },
  {
    label: "Link",
    key: "url",
    width: "170px",
    sortable: false,
  },
  {
    label: "About",
    key: "about",
    width: "160px",
    sortable: false,
  },
  {
    label: "Tags",
    key: "tagsName",
    width: "160px",
    sortable: false,
  },
  {
    label: "Author",
    key: "author",
    width: "130px",
  },
  {
    label: "Duration",
    key: "duration",
    sortable: false,
    width: "100px",
    render: (rowData: any) => formatDuration(rowData.duration),
  },

  {
    label: "Action",
    key: "action",
    width: "125px",
    sortable: false,
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const selectedRowData = props.selectedRowData;
  const handleSaveAction = props.handleSaveAction;
  const variantSelectOptions = props.variantSelectOptions;
  const tagsList = props.tagsList;
  const modalType = props.modalType;

  if (modalType === "video-play") {
    return <VideoPlayModal selectedRowData={selectedRowData} />;
  }
  return (
    <EditLearnForm
      handleCloseModal={handleCloseModal}
      handleSaveAction={handleSaveAction}
      variantSelectOptions={variantSelectOptions}
      updateFormData={updateFormData}
      tagsList={tagsList}
      modalType={modalType}
    />
  );
};

function formatDuration(durationInSeconds: any) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  if (hours === 0) {
    return `${minutes}m`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

function ManageLearn() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [learnData, setLearnData] = useState<any>();
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [selectedRowData, setSelectedRowData] = React.useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);
  const [tagsList, setTagsList] = useState<any>([]);

  const handleGetTagAndLearnData = async () => {
    const tagResponse = await getTagsData();
    const learnResponse = await getLearnData();

    if (tagResponse) {
      if (learnResponse) {
        const modifiedLearnData = learnResponse.map((item: any) => {
          const modifiedTags = item.tags.map((tagId: any) => {
            const correspondingTag = tagResponse.find(
              (tag: any) => tag._id === tagId
            );
            return correspondingTag
              ? { _id: correspondingTag._id, tagName: correspondingTag.tagName }
              : null;
          });

          return { ...item, tags: modifiedTags };
        });

        setLearnData([...modifiedLearnData]);
      }

      setTagsList([...tagResponse]);
    }
  };

  //to add new or edit the existing row in the table
  const handleSaveAction = async (data: any) => {
    if (data && modalType === "add") {
      const response = await postLearnData(data);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Video added successfully!",
          message: "",
          autoClose: 2000,
          icon: <Check />,
          color: "green",
        });
      }
    }

    if (data && modalType === "update") {
      const response = await patchLearnData(data);
      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "Video updated successfully!",
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
      title: "Delete the Video Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this Video Data?
          <Text fw={500}>
            Note:This action is destructive and you will have to contact support
            to restore this data.
          </Text>
        </Text>
      ),
      labels: { confirm: "Delete Video", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });

  const handleDeleteRow = async (data: any) => {
    const response = await deleteLearnData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Video deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color: "green",
      });
    }
  };

  const handleRefreshCalls = () => {
    handleGetTagAndLearnData();
  };

  useEffect(() => {
    handleGetTagAndLearnData();
  }, []);
  useEffect(() => {
    handleGetTagAndLearnData();
  }, []);

  useEffect(() => {
    if (learnData && learnData.length) {
      const formattedData = learnData.map((d: any) => {
        const formattedTags = d.tags.map((t: any) => ({
          value: t?._id,
          label: t?.tagName,
        }));

        const tagNames = formattedTags.map((tag: any) => tag.label);
        return {
          ...d,
          tags: formattedTags,
          tagsName: tagNames,
          duration: formatDuration(d.duration_seconds),
        };
      });
      setTableRowData(formattedData);
    }
  }, [learnData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add"
          ? "Add Video and Description"
          : modalType === "video-play"
          ? ""
          : "Update Variant Price and Source Location"
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
            selectedRowData={selectedRowData}
            tagsList={tagsList}
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
        showPlayAction={true}
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
        handleVideoPlay={(row: any) => {
          setModalType("video-play");
          setSelectedRowData(row);
          setModalOpen(true);
        }}
        handleRowEdit={(row: any, index: number) => {
          let obj = { ...row };
          const formObj = {
            url: obj.url,
            title: obj.title,
            author: obj.author,
            duration_seconds: obj.duration_seconds,
            about: obj.about,
            tags: obj.tags,
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

export default ManageLearn;
