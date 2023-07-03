import React from "react";
import { Space } from "@mantine/core";
import { Plus } from "tabler-icons-react";

import EditChaForm from "../../forms/ManageCha/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";

import {
  getChaData,
  getDestinationData,
  getRegionSource,
  postChaData,
} from "../../services/export-costing/CHA";

const columns = [
  {
    label: "Destination",
    key: "_destinationPortId",
    sortable: true,
  },
  {
    label: "Origin",
    key: "originPort",
    sortable: true,
  },
  {
    label: "CHA",
    key: "chaCharge",
  },
  {
    label: "SilicaGel",
    key: "silicaGel",
  },
  {
    label: "CraftPaper",
    key: "craftPaper",
  },
  {
    label: "Transport",
    key: "transportCharge",
  },
  {
    label: "Custom",
    key: "customCharge",
  },
  {
    label: "Loading",
    key: "loadingCharge",
  },
  {
    label: "COO",
    key: "coo",
  },
  {
    label: "Actions",
    key: "action",
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const regionSelectOptions = props.regionSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const handleSaveAction = props.handleSaveAction;

  return (
    <EditChaForm
      handleCloseModal={handleCloseModal}
      regionSelectOptions={regionSelectOptions}
      destinationSelectOptions={destinationSelectOptions}
      handleSaveAction={handleSaveAction}
    />
  );
};

function ManageChaContainer() {
  const [modalOpen, setModalOpen] = React.useState<any>(false);
  const [modalType, setModalType] = React.useState<string>("add");
  const [chaData, setChaData] = React.useState<any>([]);
  const [regionSelectOptions, setRegionSelectOptions] = React.useState<any>([]);
  const [destinationSelectOptions, setDestinationSelectOptions] =
    React.useState<any>([]);
  const [tableRowData, setTableRowData] = React.useState<any>([]);

  const getCHAList = async (regionList: any) => {
    const chaDataResponse: any = await getChaData(regionList);
    try {
      if (chaDataResponse) {
        let array: any = regionList?.map((item: any) => {
          let destinationArr: any = [];
          let originIdStringArr: any = [];

          chaDataResponse.forEach((region: any) => {
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

        setChaData(() => [...array]);
      }
    } catch (error) {
      console.log(error);
    }
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
      getCHAList(formattedRegion);
    }
  };

  const handleSaveAction = async (payload: any) => {
    if (payload) {
      const chaResponse = await postChaData(payload);

      if (chaResponse) {
        handleGetRegionSource();
      }
    }
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
    if (chaData.length) {
      let tableData: any = [];

      [...chaData].forEach((d: any) => {
        d.list.forEach((l: any) => {
          const obj = {
            ...l,
            originPort: d.name,
            _originPortId: d._originId,
          };
          tableData.push(obj);
        });
      });

      setTableRowData(tableData);
    }
  }, [chaData]);

  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add CHA Charges" : "Update CHA Charges"
      }
      modalSize="60%"
      onModalClose={() => setModalOpen(false)}
      ModalContent={() => {
        if (modalType === "add") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: boolean) => setModalOpen(bool)}
              regionSelectOptions={regionSelectOptions}
              destinationSelectOptions={destinationSelectOptions}
              handleSaveAction={handleSaveAction}
            />
          );
        }

        if (modalType === "update") {
          return (
            <RenderModalContent
              handleCloseModal={(bool: boolean) => setModalOpen(bool)}
              regionSelectOptions={regionSelectOptions}
              destinationSelectOptions={destinationSelectOptions}
            />
          );
        }
      }}
    >
      <Space h="sm" />

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
        handleRowEdit={(row: any, rowIndex: number) => {
          const destinationListWithSameOrigin = [...tableRowData].filter(
            (item: any) => {
              if (item._originPortId === row._originPortId) {
                let obj = { ...row };
                delete obj["updatedAt"];
                delete obj["_id"];
                delete obj["_originPortId"];
                delete obj["createdAt"];
                delete obj["originPort"];

                return {
                  ...obj,
                };
              }
            }
          );
          const formObj = {
            _originPortId: row._originPortId,
            destinations: [...destinationListWithSameOrigin],
          };
          console.log(formObj);
          setModalType("update");
          setModalOpen(true);
        }}
        handleRowDelete={(row: any, rowIndex: number) => {
          console.log("delete", row, rowIndex);
          setModalType("delete");
          setModalOpen(true);
        }}
      />
    </PageWrapper>
  );
}

export default ManageChaContainer;
