import React, {useEffect,useState} from "react";
import { Plus, Check} from "tabler-icons-react";
import { Text} from "../../components/index";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

import EditChaForm from "../../forms/ManageCha/index";
import PageWrapper from "../../components/Wrappers/PageWrapper";
import DataTable from "../../components/DataTable/DataTable";
import { getContainerData } from "../../services/export-costing/Container";
import {
  getChaData,
  getDestinationData,
  getOriginData,
  postChaData,
  deleteChaData,
  patchChaData,
} from "../../services/export-costing/CHA";

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
    label: "PQC",
    key: "pqc",
  },
  {
    label: "COO",
    key: "coo",
  },
  {
    label: "Action",
    key: "action",
  },
];

const RenderModalContent = (props: any) => {
  const handleCloseModal = props.handleCloseModal;
  const originSelectOptions = props.originSelectOptions;
  const destinationSelectOptions = props.destinationSelectOptions;
  const containerSelectOptions=props.containerSelectOptions;
  const updateFormData = props.updateFormData;
  const handleSaveAction = props.handleSaveAction;
  const modalType = props.modalType;

  return (
    <EditChaForm
      handleCloseModal={handleCloseModal}
      originSelectOptions={originSelectOptions}
      destinationSelectOptions={destinationSelectOptions}
      containerSelectOptions={containerSelectOptions}
      handleSaveAction={handleSaveAction}
      updateFormData={updateFormData}
      modalType={modalType}
    />
  );
};

function ManageChaContainer() {
  const [modalOpen, setModalOpen] = useState<any>(false);
  const [modalType, setModalType] = useState<string>("add");
  const [chaData, setChaData] = useState<any>([]);
  const [originSelectOptions, setOriginSelectOptions] = useState<any>([]);
  const [destinationSelectOptions, setDestinationSelectOptions] = useState<any>([]);
  const [containerSelectOptions, setContainerSelectOptions] = useState<any>([]);
  const [updateFormData, setUpdateFormData] = useState<any>(null);
  const [tableRowData, setTableRowData] = useState<any>([]);

  //to get CHA Data from database
  const handleGetCha= async (data: any) => {
    const response: any = await getChaData();
    try {
      if (response) {
        let array: any = data?.map((item: any) => {
          let destinationArr: any = [];
          let originIdStringArr: any = [];

          response.forEach((region: any) => {
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

  const handleGetOriginData = async () => {
    const response = await getOriginData();
    if (response) {
      const formattedOrigin = response.origin.map((d: any) => {
        return {
          name: d.portName,
          _originId: d._id,
          list: [],
        };
      });

      const originOptions = response.origin.map((d: any) => {
        return {
          label: d.portName,
          value: d._id,
        };
      });

      setOriginSelectOptions(() => [...originOptions]);

      handleGetDestination();
      handleGetContainer();
      handleGetCha(formattedOrigin);
    }
  };


  //to get Destination Data from database
  const handleGetDestination = async () => {
    const response = await getDestinationData();

    if (response) {
      const destinationOptions = response.destination.map(
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

  //to get Container Data from database
  const handleGetContainer = async () => {
    const response = await getContainerData();

    if (response) {
      const containerOptions = response.map(
        (d: any) => {
          return {
            label:`${d.type} - ${d.size} - ${d.weight}${d.unit}`,
            value: d._id,
          };
        }
      );
      setContainerSelectOptions(() => [...containerOptions]);
    }
  };


 //to add new or edit the existing row in the table
  const handleSaveAction = async (data:any) => {

    if (data && modalType === "add") {
      const response = await postChaData(data);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "CHA Charges Added!",
          message: "",
          autoClose: 4000,
          icon: <Check />,
          color:'green',
        });   
      }
    }

    if (data && modalType === "update") {
      const response = await patchChaData(data);

      if (response) {
        handleRefreshCalls();
        showNotification({
          title: "CHA Charges Updated!",
          message: "",
          autoClose: 4000,
          icon: <Check />,
          color:'green',
        });   
      }
    }
  };

  //to delete a single row data
  const openDeleteModal = (rowData: any) =>
    openConfirmModal({
      title: "Delete the CHA Data",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete the CHA Data? 
          <Text fw={500}>Note:This action is destructive and you will have to contact support to restore
          this data.</Text> 
          </Text>
      ),
      labels: { confirm: "Delete CHA Data", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleDeleteRow(rowData),
    });
  const handleDeleteRow = async (data: any) => {
    const response = await deleteChaData(data);

    if (response) {
      handleRefreshCalls();
      showNotification({
        title: "CHA Charges Deleted!",
        message: "",
        autoClose: 4000,
        icon: <Check />,
        color:'green',
      });
    }  
  };

  const handleRefreshCalls = () => {
    handleGetOriginData();
  };

  React.useEffect(() => {
    handleGetOriginData();
  }, []);

useEffect(() => {
  if (chaData.length && destinationSelectOptions.length) {
    const tableData = chaData.flatMap((d:any) => {
      return d.list.map((l:any) => {
        const destination = destinationSelectOptions.find(
          (option:any) => option.value === l._destinationPortId
        );
        return {
          ...l,
          originPort: d.name,
          destinationPort: destination ? destination.label : "Null",
          _originPortId: d._originId,
        };
      });
    });
    setTableRowData(tableData);
  }
}, [chaData, destinationSelectOptions]);


  return (
    <PageWrapper
      PageHeader={() => null}
      PageAction={() => null}
      modalOpen={modalOpen}
      modalTitle={
        modalType === "add" ? "Add CHA Charges" : "Update CHA Charges"
      }
      onModalClose={() => {
        setModalOpen(false)
        setUpdateFormData(null);
      }}

      ModalContent={() => {
          return (
            <RenderModalContent
              handleCloseModal={(bool: boolean) => setModalOpen(bool)}
              originSelectOptions={originSelectOptions}
              handleSaveAction={handleSaveAction}
              destinationSelectOptions={destinationSelectOptions}
              containerSelectOptions={containerSelectOptions}
              updateFormData={updateFormData}
              modalType={modalType}
              modalOpen={modalOpen}
            />
          );
      }}
      modalSize="60%"
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
            _originPortId: obj._originPortId,
            _id: obj._id,
            destinations: [
              {
                _destinationPortId: obj._destinationPortId,
                _containerId:obj._containerId,
                chaCharge: obj.chaCharge,
                silicaGel: obj.silicaGel,
                craftPaper: obj.craftPaper,
                transportCharge: obj.transportCharge,
                loadingCharge: obj.loadingCharge,
                customCharge: obj.customCharge,
                pqc: obj.pqc,
                coo: obj.coo,
              },
            ],
          }
          
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

export default ManageChaContainer;
