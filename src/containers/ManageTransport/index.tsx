import React, { useEffect, useState } from "react";
import {
  Group,
  Popover,
  Space,
} from "@mantine/core";
import { Pencil, X, Check, Plus } from "tabler-icons-react";
import {
  Button,
  Text,
  ActionIcon,
} from "../../components/index";

import EditTransportForm from "../../forms/ManageTransport/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";

import {
  getOriginData,
  getSourceData,
  getTransportData,
  postTransportData,
} from "../../services/export-costing/Transport";

const columns = [
  {
    label: "Origin",
    key: "originPort",
    sortable:true,
  },
  {
    label: "Source",
    key: "source",
    sortable:true,
  },
  {
    label: "State",
    key: "state",
  },
  {
    label: "Charges",
    key: "transportationCharge",
  },
  {
    label: "Action",
    key: "action",
  },
];

const RenderPageAction = (props: any) => {
  const handleSaveAction = props.handleSaveAction;
  const handleEditAction = props.handleEditAction;
  const editModeActive = props.editModeActive;

  if (editModeActive) {
    return (
      <Group position="right" spacing="md">
        <ActionIcon
          variant="filled"
          color="gray"
          sx={{
            "&[data-disabled]": { opacity: 0.4 },
          }}
          onClick={() => handleEditAction(false)}
        >
          <X size={16} />
        </ActionIcon>

        <Popover
          width={250}
          trapFocus
          position="bottom-end"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <ActionIcon
              variant="filled"
              color="blue"
              sx={{
                "&[data-disabled]": { opacity: 0.4 },
              }}
            >
              <Check size={16} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown
            sx={(theme) => ({
              background:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.white,
            })}
          >
            <Text size="sm">Are you sure you want to save the changes</Text>
            <Space h="sm" />
            <Group position="right" spacing="md">
              <Button
                size="xs"
                color="gray"
                onClick={() => handleEditAction(false)}
              >
                Cancel
              </Button>
              <Button
                size="xs"
                color="blue"
                onClick={() => {
                  if (handleSaveAction) {
                    handleSaveAction();
                  }
                  handleEditAction(false);
                }}
              >
                Save
              </Button>
            </Group>
          </Popover.Dropdown>
        </Popover>
      </Group>
    );
  }

  return (
    <ActionIcon
      variant="filled"
      color="gray"
      sx={{
        "&[data-disabled]": { opacity: 0.4 },
      }}
      onClick={() => handleEditAction(true)}
    >
      <Pencil size={16} />
    </ActionIcon>
  );
};

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const sourceSelectOptions = props.sourceSelectOptions;
  const originSelectOptions = props.originSelectOptions;
  const handleUpdateTransportUIData = props.handleUpdateTransportUIData;

  return (
    <EditTransportForm
      handleCloseModal={handleCloseModal}
      originSelectOptions={originSelectOptions}
      sourceSelectOptions={sourceSelectOptions}
      handleUpdateTransportUIData={handleUpdateTransportUIData}
    />
  );
};

function ManageTransportContainer() {
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>("edit");
  const [transportData, setTransportData] = React.useState<any>([]);
  const [sourceSelectOptions, setSourceSelectOptions] = React.useState<any>([]);
  const [originSelectOptions, setOriginSelectOptions] = React.useState<any>([]);
  const [transportAPIPayload, setTransportAPIPayload] =
    React.useState<any>(null);
  const [originList, setOriginList] = useState<any>([]);
  const [sourceList, setSourceList] = useState<any>([]);
    const [tableRowData, setTableRowData] = React.useState<any>([]);

  const handleRefetchTransportList = (transportPostResponse: any) => {
    if (transportPostResponse) {
      handleGetSource();
      handleGetOrigin();
    }
  };

  const getTransportList = async () => {
    const transportResponse: any = await getTransportData();
    if (transportResponse) {
      setTransportData(() => [...transportResponse]);
    }
  };
  const handleEditAction = (bool: boolean) => {
    setEditModeActive(() => bool);
    setModalType("edit");
  };

  const handleEditToUpdateAction = () => {
    setModalType("update");
    setModalOpen(true);
  };

  const handleGetSource = async () => {
    const sourceResponse = await getSourceData();
    setSourceList(sourceResponse[0].source);

    if (sourceResponse) {
      const sourceOptions = sourceResponse[0].source.map((d: any) => {
        return {
          label: d.region,
          value: d._id,
        };
      });
      setSourceSelectOptions(() => [...sourceOptions]);
      getTransportList();
    }
  };
 
  const handleGetOrigin = async () => {
    const originResponse = await getOriginData();
    setOriginList(originResponse[0].origin);
    if (originResponse) {
      const regionOptions = originResponse[0].origin.map((d: any) => {
        return {
          label: d.portName,
          value: d._id,
        };
      });

      setOriginSelectOptions(() => [...regionOptions]);
      // getTransportList();
    }
  };
  const handleUpdateTransportUIData = (formData: any) => {
    setTransportAPIPayload({ ...formData });

    let transportArr: any = [...transportData];

    const arr = transportArr.map((d: any) => {
      if (d?._originPortId === formData?._originPortId) {
        return {
          ...d,
          sourceLocations: [...d.sourceLocations, ...formData.sourceLocations],
        };
      }
      return {
        ...d,
      };
    });

    setTransportData(() => [...arr]);
  };

  const handleSave = (bool: boolean) => {
    handleEditAction(bool);
  };

  const handleSaveAction = async () => {
    if (transportAPIPayload) {
      const transportResponse = await postTransportData(transportAPIPayload);
      if (transportResponse) {
        handleGetSource();
        handleGetOrigin();
      }
    }
  };
  useEffect(() => {
  }, [sourceList]);

  React.useEffect(() => {
    handleGetSource();
    handleGetOrigin();
  }, []);

  React.useEffect(() => {
    if (transportData.length) {
      let tableData: any = [];

      [...transportData].forEach(({ _originPortId, sourceLocations }: { _originPortId: string, sourceLocations: { transportationCharge: string, _sourcePortId: string }[] }) => {
        const originData = originList.find(({ _id }: { _id: string }) => _id === _originPortId);
        const originPort = originData ? originData.portName : '';
        sourceLocations.forEach(({ transportationCharge, _sourcePortId }) => {
          const sourceData = sourceList.find(({ _id }: { _id: string }) => _id === _sourcePortId);
          const source = sourceData ? sourceData.region : '';
          const state = sourceData ? sourceData.state : '';
  
          const obj = {
            transportationCharge,
            _sourcePortId,
            source,
            state,
            originPort,
            _originPortId,
          };
          tableData.push(obj);
        });
      });
      setTableRowData(tableData);
    }
  }, [transportData, originList, sourceList]);

  
  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => (
        <RenderPageAction
          handleActionClick={() => setModalOpen(true)}
          handleEditAction={handleSave}
          editModeActive={editModeActive}
          handleSaveAction={handleSaveAction}
        />
      )}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "edit"
          ? "Add Transportation Charges"
          : "Update Transportation Charges"
      }
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => {
        if (modalType === "edit") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: any) => setModalOpen(bool)}
              sourceSelectOptions={sourceSelectOptions}
              originSelectOptions={originSelectOptions}
              handleUpdateTransportUIData={handleUpdateTransportUIData}
            />
          );
        }

        if (modalType === "update") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: any) => setModalOpen(bool)}
              originSelectOptions={originSelectOptions}
              sourceSelectOptions={sourceSelectOptions}
            />
          );
        }
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
              setModalType("add");
              setModalOpen(true);
            },
          },
        ]}
        // handleRowEdit={(row: any, rowIndex: number) => {
        //   let obj = { ...row };
        //   delete obj["updatedAt"];
        //   delete obj["_id"];
        //   delete obj["_originPortId"];
        //   delete obj["createdAt"];
        //   delete obj["originPort"];

        //   const formObj = {
        //     _originPortId: row._originPortId,
        //     destinations: [obj],
        //   };

        //   setUpdateFormData(formObj);
        //   setModalType("update");
        //   setModalOpen(true);
        // }}
        // handleRowDelete={(row: any, rowIndex: number) => {
        //   openDeleteModal(row);
        // }}
      />
    
    </PageWrapper>
  );
}

export default ManageTransportContainer;
