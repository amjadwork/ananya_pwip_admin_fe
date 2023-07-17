import React from "react";
import { Group, Popover, Space } from "@mantine/core";
import { Pencil, Plus, X, Check } from "tabler-icons-react";
import { Button, Text, ActionIcon } from "../../components/index";
import EditOfcForm from "../../forms/ManageOfc/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";

import {
  getDestinationData,
  getOfcData,
  getRegionSource,
  postOfcData,
} from "../../services/export-costing/OFC";

const columns = [
  {
    label: "Origin",
    key: "originPort",
    sortable: true,
  },
  {
    label: "Destination",
    key: "destinationPort",
    sortable: true,
  },
  {
    label: "OFC",
    key: "ofcCharge",
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
            <Text size="sm">Are you sure you want to save the changes?</Text>
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
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const handleUpdateOfcUIData = props.handleUpdateOfcUIData;

  return (
    <EditOfcForm
      handleCloseModal={handleCloseModal}
      regionSelectOptions={regionSelectOptions}
      destinationSelectOptions={destinationSelectOptions}
      handleUpdateOfcUIData={handleUpdateOfcUIData}
    />
  );
};

function ManageOfcContainer() {
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [editModeActive, setEditModeActive] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>("add");
  const [ofcData, setOfcData] = React.useState<any>([]);
  const [regionSelectOptions, setRegionSelectOptions] = React.useState<any>([]);
  const [destinationSelectOptions, setDestinationSelectOptions] =
    React.useState<any>([]);
  const [ofcAPIPayload, setOfcAPIPayload] = React.useState<any>(null);
  const [tableRowData, setTableRowData] = React.useState<any>([]);

  const handleRefetchOfcList = (ofcPostResponse: any) => {
    if (ofcPostResponse) {
      handleGetRegionSource();
      getOFCList(ofcPostResponse);
    }
  };

  const getOFCList = async (regionList: any) => {
    const ofcResponse = await getOfcData(regionList);
    try {
      if (ofcResponse) {
        let array: any = regionList?.map((item: any) => {
          let destinationArr: any = [];
          let originIdStringArr: any = [];

          ofcResponse.forEach((region: any) => {
            if (item._originId === region._originPortId) {
              destinationArr.push(region.destinations);
              originIdStringArr.push(region._originId);
            }
          });

          return {
            ...item,
            list: originIdStringArr.includes(item._originPortId)
              ? destinationArr.flat(1)
              : [],
          };
        });

        setOfcData(() => [...array]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAction = (bool: boolean) => {
    setEditModeActive(() => bool);
    setModalType("add");
  };

  const handleEditToUpdateAction = () => {
    setModalType("update");
    setModalOpen(true);
  };

  const handleGetRegionSource = async () => {
    const regionResponse = await getRegionSource();
    if (regionResponse) {
      const formattedRegion = regionResponse[0].origin.map((d: any) => {
        return {
          name: d.portName,
          _originId: d._id,
          list: [],
        };
      });

      const regionOptions = regionResponse[0].origin.map((d: any) => {
        return {
          label: d.portName,
          value: d._id,
        };
      });

      setRegionSelectOptions(() => [...regionOptions]);

      handleGetDestination();
      getOFCList(formattedRegion);
    }
  };

  const handleUpdateOfcUIData = (formData: any) => {
    setOfcAPIPayload({ ...formData });
    let ofcArr: any = [...ofcData];

    ofcArr = ofcArr.map((d: any) => {
      if (formData._originPortId === d._originId) {
        return {
          ...d,
          list: [...d.list, ...formData.destinations],
        };
      }
      return {
        ...d,
      };
    });

    setOfcData(() => [...ofcArr]);
  };

  const handleSaveAction = async () => {
    if (ofcAPIPayload) {
      const ofcResponse = await postOfcData(ofcAPIPayload);

      if (ofcResponse) {
        handleGetRegionSource();
      }
    }
  };

  const handleSave = (bool: boolean) => {
    handleEditAction(bool);
  };

  const handleGetDestination = async () => {
    const destinationResponse = await getDestinationData();

    if (destinationResponse) {
      const destinationOptions = destinationResponse[0].destination.map(
        (d: any) => {
          return {
            label: d.portName,
            value: d._id,
          };
        }
      );

      setDestinationSelectOptions(() => [...destinationOptions]);
    }
  };
  React.useEffect(() => {
    handleGetRegionSource();
  }, []);

  React.useEffect(() => {
    if (ofcData.length && destinationSelectOptions.length) {
      let tableData: any = [];

      [...ofcData].forEach((d) => {
        d.list.forEach((l: any) => {
          const destination = destinationSelectOptions.find(
            (option: any) => option.value === l._destinationPortId
          );
          const destinationName = destination ? destination.label : "";
          const obj = {
            ...l,
            destinationPort: destinationName,
            originPort: d.name,
            _originPortId: d._originId,
          };
          tableData.push(obj);
        });
      });
      setTableRowData(tableData);
    }
  }, [ofcData, destinationSelectOptions]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => (
        <RenderPageAction
          handleActionClick={() => setModalOpen(true)}
          editModeActive={editModeActive}
          handleEditAction={handleSave}
          handleSaveAction={handleSaveAction}
        />
      )}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add OFC Charges" : "Update OFC Charges"
      }
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => {
        if (modalType === "add") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: any) => setModalOpen(bool)}
              regionSelectOptions={regionSelectOptions}
              destinationSelectOptions={destinationSelectOptions}
              handleUpdateOfcUIData={handleUpdateOfcUIData}
            />
          );
        }

        if (modalType === "update") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: any) => setModalOpen(bool)}
              regionSelectOptions={regionSelectOptions}
              destinationSelectOptions={destinationSelectOptions}
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

export default ManageOfcContainer;
