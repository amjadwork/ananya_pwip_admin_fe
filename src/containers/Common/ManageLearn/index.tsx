import React, {useEffect,useState} from "react";
import { Plus, Check} from "tabler-icons-react";
import { Text} from "../../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditLearnForm from "../../../forms/Common/ManageLearn";
import PageWrapper from "../../../components/Wrappers/PageWrapper";
import DataTable from "../../../components/DataTable/DataTable";
import  VideoPlayModal from "../../../components/VideoPlayModal/VideoPlayModal";
import {
    getTagData,
} from "../../../services/tags-management/Tags";
import {
    getLearnData,
    postLearnData,
    deleteLearnData,
    patchLearnData,
} from "../../../services/learn-management/Learn"

const columns = [
    {
        label: "Title",
        key: "title",
    },
    {
        label: "Link",
        key: "url",
        sortable: false,
      },
    {
      label: "About",
      key: "about",
      sortable: false,
    },
    {
        label: "Tags",
        key: "tags",
        sortable: false,
        render: (rowData:any) => rowData.tags.join(", "),
    },
    {
        label: "Author",
        key: "author",
    },
    {
        label: "Duration",
        key: "duration",
        sortable: false,
        render: (rowData:any) => formatDuration(rowData.duration),
    },

    {
      label: "Action",
      key: "action",
      sortable: false,
    },
  ];  

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const updateFormData = props.updateFormData;
  const selectedRowData= props.selectedRowData;
  const handleSaveAction = props.handleSaveAction;
  const variantSelectOptions=props.variantSelectOptions;
  const tagsList=props.tagsList;
  const modalType = props.modalType;

  if (modalType === "video-play") {
    return (
      <VideoPlayModal
        selectedRowData={selectedRowData}
      />
    );
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

function formatDuration(durationInSeconds:any) {
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
  const [learnData, setLearnData] = useState<any>()
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [selectedRowData, setSelectedRowData] =
  React.useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);
  const [tagsList, setTagsList] = useState<any>([]);

  //to get Learn  Data from database
  const handleGetLearnData = async () => {
        const response = await getLearnData();
        if (response) {
            setLearnData([...response]);
          }
      };

  const handleGetTagData= async () => {
    const response = await getTagData();
    if (response) {
      setTagsList([...response]);
    }
  };

 //to add new or edit the existing row in the table
  const handleSaveAction = async (data:any) => {

       if (data && modalType === "add") {
        const response = await postLearnData(data);
  
        if (response) {
          handleRefreshCalls();
          showNotification({
            title: "Video added successfully!",
            message: "",
            autoClose: 2000,
            icon: <Check />,
            color:'green',
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
          color:'green',
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
          <Text fw={500}>Note:This action is destructive and you will have to contact support to restore
          this data.</Text> 
          </Text>
      ),
      labels: { confirm: "Delete Video", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });
    
  const handleDeleteRow= async (data: any) => {
    const response = await deleteLearnData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "Video deleted successfully!",
        message: "",
        autoClose: 2000,
        icon: <Check />,
        color:'green',
      });
    }  
  };

  const handleRefreshCalls = () => {
    handleGetLearnData();
  };

  useEffect(() => {
    handleGetLearnData();
    handleGetTagData();
  }, []);

  useEffect(() => {
    if (learnData && learnData.length && tagsList.length) {
      const formattedData = learnData.map((d:any) => {
        const formattedTags = d.tags.map((id:any) => {
          const tag = tagsList.find((list:any) => list._id === id);
          return tag ? tag.tagName : "";
        });
        return {
          ...d,
          tags: formattedTags.join(", "),
          duration: formatDuration(d.duration_seconds),
        };
      });  
      setTableRowData(formattedData);
    }
  }, [learnData, tagsList]);


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
        setModalOpen(false)
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
                      url:obj.url,
                      title:obj.title,
                      author:obj.author,
                      duration_seconds:obj.duration_seconds,
                      about:obj.about,
                      tags:obj.tag,
                      _id:obj._id,
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
